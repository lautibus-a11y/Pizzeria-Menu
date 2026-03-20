
import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Admin } from './pages/Admin';

import { motion } from 'framer-motion';
import { useStore } from './store';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#');
  const { fetchInitialData, isLoading } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router based on Hash
  const renderPage = () => {
    switch (currentHash) {
      case '#':
      case '#home':
        return <Home />;
      case '#cart':
      case '#/cart':
        return <Cart />;
      case '#admin':
      case '#/admin':
        return <Admin />;
      default:
        return <Home />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#e31c1c] font-header text-6xl tracking-tighter"
        >
          PIZZERIA ITALIA
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white">
      {renderPage()}
    </div>
  );
};

export default App;
