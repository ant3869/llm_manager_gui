const { spawn } = require('child_process');
const net = require('net');

function findAvailablePort(startPort, endPort) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    
    function tryPort(currentPort) {
      if (currentPort > endPort) {
        reject(new Error(`No available ports found between ${startPort} and ${endPort}`));
        return;
      }
      
      const server = net.createServer();
      
      server.once('error', () => {
        // Port is in use, try next port
        tryPort(currentPort + 1);
      });
      
      server.once('listening', () => {
        server.close(() => {
          resolve(currentPort);
        });
      });
      
      server.listen(currentPort);
    }
    
    tryPort(port);
  });
}

async function startDev() {
  try {
    const port = await findAvailablePort(3000, 3999);
    console.log(`Starting development server on port ${port}`);
    
    const vite = spawn('vite', ['--port', port], {
      stdio: 'inherit',
      shell: true
    });

    vite.on('error', (err) => {
      console.error('Failed to start development server:', err);
      process.exit(1);
    });

  } catch (err) {
    console.error('Error finding available port:', err);
    process.exit(1);
  }
}

startDev();