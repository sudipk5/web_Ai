
import React from 'react';
import { DeploymentRecord } from '../types';

interface SiteCardProps {
  site: DeploymentRecord;
  onVisit: (site: DeploymentRecord) => void;
  onManageDomain: (site: DeploymentRecord) => void;
}

const SiteCard: React.FC<SiteCardProps> = ({ site, onVisit, onManageDomain }) => {
  const handleDownload = () => {
    if (!site.htmlContent) return;
    const blob = new Blob([site.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.name.toLowerCase().replace(/\s/g, '-')}-production.html`;
    a.click();
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600/10 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{site.name}</h3>
            <p className="text-xs text-gray-500">Deployed {new Date(site.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live
          </span>
          {site.customDomain && (
            <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Production
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Framework</span>
          <span className="text-gray-300 font-medium">{site.framework}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Primary URL</span>
          <button onClick={() => onVisit(site)} className="text-indigo-400 hover:underline">
            {site.customDomain || site.url}
          </button>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-2">
        <button 
          onClick={() => onVisit(site)}
          className="bg-white text-black py-2 rounded-lg text-xs font-bold text-center hover:bg-gray-200 transition-colors"
        >
          Visit Site
        </button>
        <button 
          onClick={() => onManageDomain(site)}
          className="bg-gray-800 text-gray-300 py-2 rounded-lg text-xs font-bold text-center hover:bg-gray-700 transition-colors"
        >
          Connect Domain
        </button>
      </div>

      <div className="mt-2">
        <button 
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-gray-500 transition-all text-[10px] font-bold uppercase tracking-widest"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download for Production
        </button>
      </div>
    </div>
  );
};

export default SiteCard;
