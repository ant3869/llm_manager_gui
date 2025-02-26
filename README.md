# LLM Manager GUI

A comprehensive interface for managing, interacting with, and monitoring Large Language Models (LLMs).

## Overview

LLM Manager GUI is a full-stack application that provides a user-friendly interface for working with language models. It offers features for chat interactions, model configuration, performance monitoring, training management, and data preparation.

## Features

- **Interactive Chat Interface**: Communicate with language models through a clean, intuitive chat interface
- **Model Configuration**: Fine-tune model parameters including temperature, top-p, max tokens, and more
- **System Prompt Management**: Create and manage system prompts to guide model behavior
- **Performance Monitoring**: Track token usage, response times, and system resource utilization
- **Training Dashboard**: Manage model training processes and view training history
- **Data Preparation Tools**: Clean and prepare data for model training
- **Resource Utilization**: Monitor CPU, memory, and other system resources
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing

## Tech Stack

- **Frontend**: React, TailwindCSS, Framer Motion, Recharts
- **Backend**: Node.js, Express, WebSockets
- **Database**: SQLite (in-memory)
- **Build Tools**: Vite, PostCSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ant3869/llm_manager_gui.git
   cd llm_manager_gui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. In a separate terminal, start the backend server:
   ```
   npm run server
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
llm_manager_gui/
├── src/                    # Source files
│   ├── components/         # React components
│   │   ├── dataprep/       # Data preparation components
│   │   └── training/       # Training-related components
│   ├── database/           # Database configuration and queries
│   ├── monitoring/         # Performance monitoring
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── websocket/          # WebSocket server implementation
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── server.js           # Express server
├── public/                 # Static files
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.cjs     # Tailwind CSS configuration
└── package.json            # Project dependencies and scripts
```

## Available Scripts

- `npm run dev`: Start the Vite development server
- `npm run build`: Build the project for production
- `npm run preview`: Preview the production build
- `npm run server`: Start the backend server

## API Endpoints

- `/api/models`: Model management endpoints
- `/api/chat`: Chat and conversation endpoints
- `/api/monitoring`: Performance monitoring endpoints
- `/api/config`: Configuration endpoints

## WebSocket Communication

The application uses WebSockets for real-time communication between the client and server, enabling features like streaming responses and live performance metrics.

## Database Schema

The application uses an in-memory SQLite database with the following tables:
- `conversations`: Stores chat conversations
- `messages`: Stores individual messages within conversations
- `model_configs`: Stores model configuration presets
- `performance_metrics`: Stores performance data for analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing UI library
- TailwindCSS for the utility-first CSS framework
- Vite for the blazing fast build tool
