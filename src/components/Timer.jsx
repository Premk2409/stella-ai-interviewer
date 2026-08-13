import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ isActive = true }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num) => (num < 10 ? '0' : '') + num;

    if (hours > 0) {
      return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Duration</span>
      </div>
      <span className="text-sm font-black text-slate-900 font-mono">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
export default Timer;
