import React from 'react';
import { Sparkles, Radio, AlertCircle } from 'lucide-react';

export default function AIAvatar({ isSpeaking = false, connectionStatus = 'CONNECTED' }) {
  const statusColors = {
    CONNECTED: "bg-emerald-500 text-emerald-100 border-emerald-400/20",
    RECONNECTING: "bg-amber-500 text-amber-100 border-amber-400/20 animate-pulse",
    DISCONNECTED: "bg-red-500 text-red-100 border-red-400/20"
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center space-y-5 text-center shrink-0 w-full min-h-[300px]">
      <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-400">Stella Presenter Block</span>
        </div>

        {/* Connection status indicator */}
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[connectionStatus] || statusColors.CONNECTED}`}>
          {connectionStatus === 'RECONNECTING' && <AlertCircle size={10} />}
          {connectionStatus}
        </span>
      </div>

      <div className="relative">
        {/* Ripple rings to simulate speech speaking waves */}
        <div className={`absolute -inset-4 rounded-full bg-blue-500/10 blur-md transition-all duration-700
          ${isSpeaking ? 'scale-125 opacity-100 animate-pulse' : 'scale-90 opacity-40'}
        `}></div>
        
        <div className="relative h-20 w-24 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-full flex items-center justify-center shadow-xl border-2 border-blue-400/30">
          <Sparkles size={36} className="text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white">Stella AI</h3>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Senior Technical Interviewer</p>
      </div>

      {isSpeaking ? (
        <div className="flex gap-0.5 items-end justify-center h-6">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className="w-1 bg-blue-500 rounded-full animate-bounce"
              style={{ 
                height: `${Math.floor(Math.random() * 16) + 6}px`, 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            ></span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 italic">Stella is ready and listening...</p>
      )}
    </div>
  );
}
export default AIAvatar;
