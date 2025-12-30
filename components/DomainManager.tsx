
import React, { useState, useEffect } from 'react';

interface DomainManagerProps {
  onDomainPurchased: (domain: string) => void;
  onDownloadOnly: () => void;
  onClose: () => void;
}

const DomainManager: React.FC<DomainManagerProps> = ({ onDomainPurchased, onDownloadOnly, onClose }) => {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{domain: string, price: string, available: boolean}[]>([]);
  const [step, setStep] = useState<'search' | 'checkout' | 'payment' | 'verifying' | 'dns' | 'receipt'>('search');
  const [selectedDomain, setSelectedDomain] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSearch = () => {
    if (!search) return;
    setIsSearching(true);
    setTimeout(() => {
      const query = search.toLowerCase().replace(/[^a-z0-9]/g, '');
      setResults([
        { domain: `${query}.com`, price: "$12.00", available: true },
        { domain: `${query}.io`, price: "$32.00", available: true },
        { domain: `${query}.ai`, price: "$49.00", available: true },
      ]);
      setIsSearching(false);
    }, 1200);
  };

  const startPayment = () => {
    setStep('payment');
    // Simulate user scanning and banking app interaction
    setTimeout(() => {
      setStep('verifying');
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setStep('receipt');
        }
      }, 100);
    }, 5000);
  };

  const finishActivation = () => {
    setStep('dns');
    setTimeout(() => onDomainPurchased(selectedDomain), 3500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.15)]">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Secured Portal</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Stripe Enterprise Integrated</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-10 md:p-12">
          {step === 'search' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter">Choose Your Address</h3>
                <p className="text-gray-500 text-sm font-medium">Build verified. Select a production entry point.</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="nexus-portfolio"
                  className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 text-base text-white focus:outline-none focus:border-indigo-500/50 shadow-inner"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-white text-black px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Search
                </button>
              </div>

              {isSearching ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse"></div>)}
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {results.map((res) => (
                    <button 
                      key={res.domain}
                      onClick={() => { setSelectedDomain(res.domain); setStep('checkout'); }}
                      className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-indigo-500/50 transition-all hover:bg-white/[0.04] group"
                    >
                      <div className="text-left">
                        <p className="font-black text-white text-xl group-hover:text-indigo-400 transition-colors">{res.domain}</p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mt-1 tracking-widest">Premium Edge Sync</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white">{res.price}</p>
                        <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">Provision →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center pt-4">
                   <button onClick={onDownloadOnly} className="text-gray-500 hover:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors underline underline-offset-8">
                     Or Just Download Source Code
                   </button>
                </div>
              )}
            </div>
          )}

          {step === 'checkout' && (
            <div className="text-center space-y-10 animate-in zoom-in-95 duration-500">
              <div className="space-y-3 text-center">
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">Order Summary</h3>
                <p className="text-gray-500 font-medium">Provisioning {selectedDomain} on Global Edge Tier-1.</p>
              </div>
              <div className="bg-black/60 border border-white/5 rounded-[2.5rem] p-10 text-left space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">Global CDN Infrastructure</span>
                  <span className="text-green-500 font-black">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">SSL/TLS Termination</span>
                  <span className="text-green-500 font-black">VERIFIED</span>
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Total One-Time Fee</p>
                    <p className="text-5xl font-black text-white">$12.00</p>
                  </div>
                  <button 
                    onClick={startPayment}
                    className="bg-indigo-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    Authorize Now
                  </button>
                </div>
              </div>
              <button onClick={() => setStep('search')} className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors">
                ← Back to Domain Selection
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Scan to Activate</h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Transaction Reference: TXN-9982-DAI</p>
              </div>

              <div className="relative inline-block p-12 bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(79,70,229,0.5)]">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bank-auth-deployai-premium&bgcolor=ffffff&color=000000`} 
                  alt="Bank Auth" 
                  className="w-64 h-64 md:w-72 md:h-72"
                />
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/50 animate-[scan_2s_linear_infinite]"></div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-3 bg-indigo-500/10 px-4 py-2 rounded-full">
                   <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Awaiting Remote Signal...</span>
                </div>
              </div>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center space-y-12 animate-in fade-in duration-700">
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Auth Pipeline</h3>
                <p className="text-gray-500 text-sm font-medium">Interfacing with centralized gateway...</p>
              </div>
              
              <div className="relative max-w-sm mx-auto h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="bg-black/60 border border-white/5 p-8 rounded-3xl text-left font-mono text-[11px] space-y-2 shadow-2xl">
                <p className="text-indigo-400">> ESTABLISHING HANDSHAKE...</p>
                <p className="text-gray-600">> ENCRYPTING PACKET_7721...</p>
                <p className="text-gray-600">> BANK_LATENCY: 44ms</p>
                <p className="text-green-500">> MERCHANT_ID: DEPLOYAI_CORP verified.</p>
              </div>
            </div>
          )}

          {step === 'receipt' && (
            <div className="text-center space-y-10 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                 <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
               <div className="space-y-2">
                 <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">PAYMENT SUCCESS</h3>
                 <p className="text-gray-500 font-medium">Receipt emailed to your account.</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                   <span className="text-gray-600">Merchant</span>
                   <span className="text-white">DEPLOYAI LLC</span>
                 </div>
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                   <span className="text-gray-600">Product</span>
                   <span className="text-white">Cloud Activation</span>
                 </div>
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest border-t border-white/5 pt-4">
                   <span className="text-gray-600">Amount</span>
                   <span className="text-indigo-400">$12.00 USD</span>
                 </div>
               </div>
               <button 
                onClick={finishActivation}
                className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] transition-transform shadow-2xl"
               >
                 Go Live Now
               </button>
            </div>
          )}

          {step === 'dns' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
              <div className="text-center space-y-4">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-8 border-indigo-500/10 rounded-full"></div>
                   <div className="absolute inset-0 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Routing Infrastructure</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.4em]">Propagation active across 32 zones</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] shadow-xl">
                   <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3">Edge Pointer</p>
                   <p className="text-indigo-400 font-mono text-sm">A 34.120.54.99</p>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] shadow-xl">
                   <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3">TLS Engine</p>
                   <p className="text-green-500 font-mono text-sm">ENCRYPTED</p>
                </div>
              </div>

              <div className="flex justify-center gap-1.5 px-10">
                {Array.from({length: 8}).map((_, i) => (
                  <div key={i} className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite]" style={{animationDelay: `${i*0.2}s`}}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainManager;
