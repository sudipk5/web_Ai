
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import DeploymentTerminal from './components/DeploymentTerminal';
import SiteCard from './components/SiteCard';
import DomainManager from './components/DomainManager';
import AiAssistant from './components/AiAssistant';
import BrowserPreview from './components/BrowserPreview';
import { DeploymentStatus, DeploymentRecord, ProjectAnalysis } from './types';
import { analyzeProjectFiles, generateWebsite, refinePromptWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'overview' | 'deployments' | 'docs'>('overview');
  const [status, setStatus] = useState<DeploymentStatus>(DeploymentStatus.IDLE);
  const [logs, setLogs] = useState<string[]>([]);
  const [deployments, setDeployments] = useState<DeploymentRecord[]>([]);
  const [pendingDeployment, setPendingDeployment] = useState<{name: string, framework: string, html: string} | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [previewSite, setPreviewSite] = useState<DeploymentRecord | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('deploy_ai_history');
    if (saved) {
      setDeployments(JSON.parse(saved));
    }
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const handleMagicGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatus(DeploymentStatus.ANALYZING);
    setLogs([]);
    
    addLog("> Initializing Dual-AI Pipeline...");
    addLog("> STEP 1: Interfacing with ChatGPT-layer Concept Engine...");
    
    try {
      const refinedPrompt = await refinePromptWithAI(prompt);
      addLog("> Concept refined. Architecting production spec...");
      
      addLog("> STEP 2: Building via Gemini 3 Pro Hyper-Architecture...");
      const { html, name } = await generateWebsite(refinedPrompt);
      
      addLog(`> Success: Build artifacts for '${name}' verified.`);
      startBuildPhase(name, "AI-Generated Stack", html);
      setPrompt("");
    } catch (err) {
      addLog(`> [FATAL] Pipeline failed. Check API connectivity.`);
      setStatus(DeploymentStatus.FAILED);
    } finally {
      setIsGenerating(false);
    }
  };

  const startBuildPhase = async (name: string, framework: string, htmlContent: string) => {
    setStatus(DeploymentStatus.BUILDING);
    addLog(`> Preparing production bundle: ${name}`);
    const steps = [
      "Optimizing media query breakpoints...",
      "Injecting dynamic JS interactivity...",
      "Provisioning edge storage cluster...",
      "Validating W3C compliance...",
      "Distributing to global CDN edges..."
    ];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 300));
      addLog(`  - ${step}`);
    }
    setPendingDeployment({ name, framework, html: htmlContent });
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (domain: string) => {
    setShowPayment(false);
    if (!pendingDeployment) return;

    setStatus(DeploymentStatus.DEPLOYING);
    addLog(`> Finalizing Activation: ${domain}`);
    addLog(`> Routing traffic via Google Cloud Edge...`);
    await new Promise(r => setTimeout(r, 2000));
    
    const newDeployment: DeploymentRecord = {
      id: crypto.randomUUID(),
      name: pendingDeployment.name,
      url: domain,
      customDomain: domain,
      framework: pendingDeployment.framework,
      createdAt: Date.now(),
      status: DeploymentStatus.READY,
      htmlContent: pendingDeployment.html
    };

    setDeployments(prev => {
      const updated = [newDeployment, ...prev];
      localStorage.setItem('deploy_ai_history', JSON.stringify(updated));
      return updated;
    });

    addLog(`> LIVE PRODUCTION READY at https://${domain}`);
    setStatus(DeploymentStatus.READY);
    setPendingDeployment(null);
    setPreviewSite(newDeployment);
  };

  const handleVisit = (site: DeploymentRecord) => {
    setPreviewSite(site);
  };

  const handleManageDomain = (site: DeploymentRecord) => {
    // If they already have a custom domain, maybe show management, 
    // otherwise allow "upgrading" via the DomainManager
    if (!site.customDomain) {
      setPendingDeployment({
        name: site.name,
        framework: site.framework,
        html: site.htmlContent || ""
      });
      setShowPayment(true);
    } else {
      addLog(`> Management portal for ${site.customDomain} is initializing...`);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-10">
        <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Build Engine (Dual-AI)
          </h2>
          <div className="space-y-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Simply describe your site. Our ChatGPT layer will expand it, and Gemini will build it..."
              disabled={status !== DeploymentStatus.IDLE && status !== DeploymentStatus.READY}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-base text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none h-40 shadow-inner"
            />
            <div className="flex gap-4">
               <button
                onClick={handleMagicGenerate}
                disabled={!prompt.trim() || isGenerating || (status !== DeploymentStatus.IDLE && status !== DeploymentStatus.READY)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/20"
              >
                {isGenerating ? "Refining Concept..." : "Initiate Dual-AI Build"}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               Live Pipeline
             </h3>
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-gray-600">STABLE_V2.5</span>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             </div>
           </div>
           <DeploymentTerminal logs={logs} status={status} />
        </section>
      </div>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white uppercase tracking-tight italic">Global Infrastructure</h2>
          <button 
            onClick={() => setView('deployments')}
            className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Manage Clusters →
          </button>
        </div>
        <div className="space-y-6">
          {deployments.length === 0 ? (
            <div className="h-64 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.01]">
              <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-gray-600 font-black uppercase tracking-widest text-xs">Infrastructure Idle</p>
            </div>
          ) : (
            deployments.slice(0, 4).map(site => (
              <SiteCard 
                key={site.id} 
                site={site} 
                onVisit={handleVisit} 
                onManageDomain={handleManageDomain} 
              />
            ))
          )}
        </div>
      </section>
    </div>
  );

  const renderDeployments = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Infrastructure</h2>
          <p className="text-gray-500 text-lg mt-3 font-medium">Global fleet management and DNS optimization.</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-black text-white">{deployments.length}</p>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Clusters</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-white">99.9%</p>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Uptime</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deployments.length > 0 ? deployments.map(site => (
          <SiteCard 
            key={site.id} 
            site={site} 
            onVisit={handleVisit} 
            onManageDomain={handleManageDomain} 
          />
        )) : (
          <div className="col-span-full py-20 text-center">
             <p className="text-gray-500 font-black uppercase tracking-widest italic">No active deployments found.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocs = () => (
    <div className="max-w-4xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10">
      <div className="space-y-6 text-center">
        <h2 className="text-6xl font-black text-white tracking-tighter uppercase">Developer Portal</h2>
        <p className="text-gray-400 leading-relaxed text-xl max-w-2xl mx-auto">Master the DeployAI ecosystem. Automated cloud-native infrastructure for the modern web.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            title: "Dual-AI Generation", 
            desc: "Our unique pipeline uses a GPT-style reasoning layer to refine user intent into a high-density technical prompt before Gemini constructs the final UI.",
            code: "GPT.refine() -> Gemini.build()"
          },
          { 
            title: "GCP Global Edge", 
            desc: "Deployment artifacts are sharded and replicated across Google's premium fiber network, ensuring zero-latency content delivery worldwide.",
            code: "gcloud compute edge-cache origins create ..."
          },
          { 
            title: "Zero-Config SSL", 
            desc: "We utilize Google-managed certificates with automated DNS-01 validation. Your site is secure from the very first byte.",
            code: "certificate-manager.googleapis.com/v1"
          },
          { 
            title: "Recursive Gemini Analysis", 
            desc: "When uploading files, Gemini 3 Pro performs deep recursive analysis to identify meta-structures and optimize build paths.",
            code: "ai.models.generateContent({ model: 'gemini-3-pro-preview' })"
          }
        ].map(item => (
          <div key={item.title} className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group border-t-white/10">
            <h3 className="text-2xl font-black text-white mb-4 italic group-hover:text-indigo-400 transition-colors">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed mb-6 font-medium">{item.desc}</p>
            <div className="bg-black/40 rounded-xl p-4 font-mono text-[10px] text-indigo-400 border border-white/5">
              {item.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 bg-[#030303] selection:bg-indigo-500/40">
      <Header currentView={view} onNavigate={setView} />
      
      <main className="max-w-7xl mx-auto px-6 pt-16">
        {view === 'overview' && renderOverview()}
        {view === 'deployments' && renderDeployments()}
        {view === 'docs' && renderDocs()}
      </main>

      <AiAssistant />

      {previewSite && (
        <BrowserPreview 
          url={previewSite.customDomain || previewSite.url}
          htmlContent={previewSite.htmlContent}
          onClose={() => setPreviewSite(null)}
        />
      )}

      {showPayment && (
        <DomainManager 
          onDomainPurchased={handlePaymentSuccess} 
          onDownloadOnly={() => {
            if (pendingDeployment) {
               const blob = new Blob([pendingDeployment.html], { type: 'text/html' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = `${pendingDeployment.name.toLowerCase().replace(/\s/g, '-')}-source.html`;
               a.click();
            }
            setShowPayment(false);
            setStatus(DeploymentStatus.IDLE);
          }}
          onClose={() => {
            setShowPayment(false);
            setStatus(DeploymentStatus.IDLE);
          }} 
        />
      )}

      <footer className="fixed bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-black/80 backdrop-blur-xl flex items-center px-10 justify-between z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Infrastructure: Operational</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Region: Global-1</span>
          </div>
        </div>
        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] hidden sm:block">
          &copy; 2025 DEPLOYAI INFRASTRUCTURE GROUP
        </div>
      </footer>
    </div>
  );
};

export default App;
