import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center p-6 md:p-10">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
        Zinksooo
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Automask yo panels, and do whatever to it, dis SP
      </p>
    </header>
  );
};

export default Header;