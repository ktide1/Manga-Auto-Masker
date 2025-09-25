
import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = 'flex items-center gap-2 px-6 py-3 font-semibold text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500';
  const activeClasses = 'text-white border-b-2 border-indigo-500 shadow-[0_4px_14px_0_rgba(79,70,229,0.3)]';
  const inactiveClasses = 'text-gray-400 hover:text-white';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TabButton;