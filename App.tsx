
import React, { useState, useCallback } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import ImageProcessor from './components/ImageProcessor';
import TabButton from './components/TabButton';
import { MagicWandIcon, PencilIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.COLORIZE);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col items-center">
      <Header />
      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-grow">
        <div className="flex justify-center mb-8 border-b border-gray-800">
          <TabButton
            label="Colorizer"
            icon={<MagicWandIcon />}
            isActive={activeTab === Tab.COLORIZE}
            onClick={() => handleTabChange(Tab.COLORIZE)}
          />
          <TabButton
            label="Editor"
            icon={<PencilIcon />}
            isActive={activeTab === Tab.EDIT}
            onClick={() => handleTabChange(Tab.EDIT)}
          />
        </div>

        <div className="bg-gray-950 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-800">
          <ImageProcessor activeTab={activeTab} key={activeTab} />
        </div>
      </main>
      <footer className="w-full text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini AI. Created for illustrative purposes.</p>
      </footer>
    </div>
  );
};

export default App;