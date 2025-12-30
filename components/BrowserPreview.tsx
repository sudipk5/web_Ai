
import React from 'react';

interface BrowserPreviewProps {
  url: string;
  htmlContent?: string;
  onClose: () => void;
}

const BrowserPreview: React.FC<BrowserPreviewProps> = ({ url, htmlContent, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#1a1a1a] rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col">
        {/* Browser Header */}
        <div className="bg-[#242424] px-6 py-4 flex items-center gap-6 border-b border-white/5">
          <div className="flex gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer shadow-lg shadow-red-500/20" onClick={onClose}></div>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
          </div>
          
          <div className="flex gap-4 text-gray-500">
            <svg className="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            <svg className="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            <svg className="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          
          <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-2.5 flex items-center justify-between group shadow-inner">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center gap-1.5 text-green-500">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              </div>
              <span className="text-xs text-gray-400 font-bold truncate tracking-tight">https://{url}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-indigo-500/60 uppercase tracking-widest hidden sm:block">Edge Protocol v1.3</span>
               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            </div>
          </div>
          
          <button onClick={onClose} className="bg-white text-black text-[10px] font-black uppercase px-4 py-2 rounded-xl hover:bg-gray-200 transition-all">
            Dashboard
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 bg-white relative">
          {htmlContent ? (
            <iframe 
              srcDoc={htmlContent} 
              className="w-full h-full border-none shadow-2xl"
              title="Live Preview"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#111] text-gray-400 p-12 text-center">
              <div className="w-24 h-24 bg-indigo-600/10 text-indigo-500 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20 animate-pulse">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase italic">Activating Sandbox</h2>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed">Initializing isolated execution context on the nearest global edge node...</p>
            </div>
          )}
        </div>

        {/* Browser Footer */}
        <div className="bg-[#242424] px-8 py-3 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Inspect Element</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terminal Console</span>
            <span className="hover:text-white cursor-pointer transition-colors">Network: 1.2ms</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-indigo-400">Status: Production Live</span>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserPreview;
