import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Square, Play, PhoneOff } from 'lucide-react';

export default function AudioRecorder({ 
  isRecording = false, 
  onStartRecord, 
  onStopRecord, 
  onEndSession,
  disabled = false 
}) {
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Mic Status Label */}
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-300
          ${isRecording 
            ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' 
            : 'bg-slate-800 border-slate-700 text-slate-400'
          }
        `}>
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </div>
        <div>
          <p className="text-xs font-bold text-white">
            {isRecording ? 'Active Recording Mode' : 'Microphone Ready'}
          </p>
          <p className="text-[10px] text-slate-400">
            {isMuted ? 'Local audio stream muted' : isRecording ? 'Transmitting active PCM packets' : 'Click record to speak'}
          </p>
        </div>
      </div>

      {/* Control Buttons Group */}
      <div className="flex items-center gap-3">
        {/* Mute/Unmute Toggle */}
        <button
          onClick={handleMuteToggle}
          className={`p-3 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer
            ${isMuted 
              ? 'bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }
          `}
          title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          disabled={disabled}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Start/Stop Recording Toggle */}
        <button
          onClick={isRecording ? onStopRecord : onStartRecord}
          disabled={disabled || isMuted}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-[0.98] duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
            ${isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/10' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
            }
          `}
        >
          {isRecording ? <Square size={14} fill="white" /> : <Play size={14} fill="white" />}
          <span>{isRecording ? 'Stop Recording' : 'Record Answer'}</span>
        </button>
      </div>

      {/* Hangup / End Button */}
      <button
        onClick={onEndSession}
        className="px-5 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 hover:border-red-600 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
      >
        <PhoneOff size={14} />
        <span>End Interview</span>
      </button>
    </div>
  );
}
export default AudioRecorder;
