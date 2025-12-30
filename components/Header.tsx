
import React from 'react';

interface HeaderProps {
  currentView: 'overview' | 'deployments' | 'docs';
  onNavigate: (view: 'overview' | 'deployments' | 'docs') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate('overview')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            Deploy<span className="text-indigo-500">AI</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
          <button 
            onClick={() => onNavigate('overview')}
            className={`transition-all hover:text-white ${currentView === 'overview' ? 'text-indigo-400' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => onNavigate('deployments')}
            className={`transition-all hover:text-white ${currentView === 'deployments' ? 'text-indigo-400' : 'text-gray-500'}`}
          >
            Deployments
          </button>
          <button 
            onClick={() => onNavigate('docs')}
            className={`transition-all hover:text-white ${currentView === 'docs' ? 'text-indigo-400' : 'text-gray-500'}`}
          >
            Documentation
          </button>
          <div className="h-4 w-px bg-gray-800"></div>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            Console
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
