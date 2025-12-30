
import React, { useEffect, useRef } from 'react';

interface DeploymentTerminalProps {
  logs: string[];
  status: string;
}

const DeploymentTerminal: React.FC<DeploymentTerminalProps> = ({ logs, status }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full bg-black rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          {status}
        </div>
      </div>
      <div className="p-4 h-64 overflow-y-auto mono text-sm space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
            <span className={
              log.includes('error') ? 'text-red-400' :
              log.includes('warn') ? 'text-yellow-400' :
              log.includes('success') ? 'text-green-400' :
              log.includes('>') ? 'text-indigo-400 font-bold' :
              'text-gray-300'
            }>
              {log}
            </span>
          </div>
        ))}
        {status === 'BUILDING' && (
          <div className="text-green-500 animate-pulse">_</div>
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default DeploymentTerminal;
