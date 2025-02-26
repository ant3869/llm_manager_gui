import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TrainingDashboard from './components/training/TrainingDashboard';
import DataPrepDashboard from './components/dataprep/DataPrepDashboard';
import Dashboard from './components/Dashboard';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('chat');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatInterface />;
      case 'training':
        return <TrainingDashboard />;
      case 'dataprep':
        return <DataPrepDashboard />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <div className={`transition-margin ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Header 
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="p-6">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </div>
  );
}
