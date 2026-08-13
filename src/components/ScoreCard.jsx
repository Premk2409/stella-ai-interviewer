import React from 'react';
import { Award } from 'lucide-react';

export default function ScoreCard({ score = 0, feedback = 'Awaiting vocal response...' }) {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Evaluation score</span>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
          {score}%
        </span>
      </div>

      {/* Progress slider bar */}
      <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${score}%` }}
        ></div>
      </div>

      <div className="bg-white border border-slate-150 p-2.5 rounded-lg">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Real-time feedback</p>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          "{feedback}"
        </p>
      </div>
    </div>
  );
}
export default ScoreCard;
