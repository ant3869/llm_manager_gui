import sqlite3 from 'sqlite3';
import { logger } from '../utils/logger.js';

let db;

export function setupDatabase() {
  return new Promise((resolve, reject) => {
    try {
      db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
          logger.error('Database connection failed:', err);
          reject(err);
          return;
        }
        
        db.serialize(() => {
          // Conversations table
          db.run(`CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id TEXT,
            model_config_id TEXT
          )`);

          // Messages table with additional metadata
          db.run(`CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            role TEXT,
            content TEXT,
            tokens INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            feedback INTEGER DEFAULT 0,
            processing_time INTEGER,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id)
          )`);

          // Model configurations
          db.run(`CREATE TABLE IF NOT EXISTS model_configs (
            id TEXT PRIMARY KEY,
            name TEXT,
            temperature REAL,
            top_p REAL,
            max_tokens INTEGER,
            presence_penalty REAL,
            frequency_penalty REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`);

          // Performance metrics
          db.run(`CREATE TABLE IF NOT EXISTS performance_metrics (
            id TEXT PRIMARY KEY,
            message_id TEXT,
            response_time INTEGER,
            token_count INTEGER,
            memory_usage INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (message_id) REFERENCES messages(id)
          )`);

          logger.info('Database initialized successfully');
          resolve();
        });
      });
    } catch (error) {
      logger.error('Database initialization failed:', error);
      reject(error);
    }
  });
}

export function getDb() {
  return db;
}

// Enhanced query helpers with better error handling
export async function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        logger.error('Query execution failed:', err);
        reject(err);
      } else {
        resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      }
    });
  });
}

export async function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        logger.error('Query execution failed:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Transaction helper
export async function runTransaction(queries) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      try {
        queries.forEach(({ query, params }) => {
          db.run(query, params);
        });
        
        db.run('COMMIT', (err) => {
          if (err) {
            logger.error('Transaction failed:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (error) {
        db.run('ROLLBACK');
        logger.error('Transaction failed:', error);
        reject(error);
      }
    });
  });
}
