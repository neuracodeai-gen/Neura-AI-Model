import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SettingsModal from './SettingsModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
        </main>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default Layout;
