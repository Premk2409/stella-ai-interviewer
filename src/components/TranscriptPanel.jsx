import React, { useEffect, useRef } from 'react';
import { Sparkles, User, CornerDownLeft } from 'lucide-react';

export default function TranscriptPanel({ transcripts = [] }) {
  const scrollRef = useRef(null);

  // Auto-scroll to the bottom whenever transcripts array is updated
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[350px] shadow-sm overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-150 flex items-center gap-2 bg-slate-50/50">
        <CornerDownLeft size={16} className="text-slate-400" />
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Conversational Transcript</h2>
      </div>

      {/* Transcript Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {transcripts.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4">
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              No conversational interactions logged yet. Microphones and socket streams are calibrated and ready.
            </p>
          </div>
        ) : (
          transcripts.map((entry, idx) => {
            const isStella = entry.speaker === 'stella' || entry.speaker === 'ai' || entry.speaker === 'system';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isStella ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-left'}`}
              >
                {/* Avatar Icon bubble */}
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm
                  ${isStella 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-blue-400'
                  }
                `}>
                  {isStella ? <Sparkles size={14} /> : <User size={14} />}
                </div>

                {/* Content Bubble */}
                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl shadow-sm border text-xs leading-relaxed font-mono
                    ${isStella 
                      ? 'bg-blue-50 border-blue-100 text-slate-800 rounded-tl-none' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 rounded-tr-none'
                    }
                  `}>
                    {entry.text}
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold px-1">{entry.timestamp}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>
    </div>
  );
}
export default TranscriptPanel;
