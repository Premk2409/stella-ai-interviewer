import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Video, 
  CornerDownLeft, 
  CheckCircle2, 
  ChevronRight,
  User,
  AlertCircle
} from 'lucide-react';
import { PATHS } from '../utils/paths';
import useAudioRecorder from '../hooks/useAudioRecorder';
import { interviewApi } from '../services/interviewApi';
import apiClient from '../services/apiClient';
import useWebSocket from '../hooks/useWebSocket';

const MOCK_QUESTIONS = {
  'Senior Frontend Engineer': [
    "Could you describe your experience with modern performance optimization in React 19? What strategies do you use for high-volume state re-renders?",
    "How do you design a reusable component library, and what is your architectural approach to state management (Zustand, Redux, Context API)?",
    "Explain how you would implement structural error boundaries, offline support, and API polling mechanisms in a production React dashboard."
  ],
  'Backend Node/Java Engineer': [
    "How do you design high-throughput microservices using Node.js or Java Spring Boot? Detail your approach to message queues (Kafka, RabbitMQ).",
    "Explain how you handle database connection pooling and query optimization in PostgreSQL or MongoDB when scaling to millions of concurrent reads.",
    "Describe your process for implementing JWT authentication, OAuth 2.0 flow, and API rate limiting on reverse proxies (NGINX)."
  ],
  'Product Manager': [
    "How do you prioritize your product backlog? Describe your workflow using RICE framework or user feedback analysis.",
    "Describe a time when you had to make a critical product pivot based on market research. How did you align the engineering and executive teams?",
    "How do you define and track key success metrics for an AI-powered SaaS product launch?"
  ],
  'default': [
    "Please introduce yourself and explain what sparked your interest in joining our development team as a specialist.",
    "How do you resolve high-priority architectural conflicts or design differences when working within cross-functional teams?",
    "Tell us about a complex technical challenge you faced. How did you diagnose the root cause, and what was your final implementation?"
  ]
};

export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load Candidate Data
  const candidate = location.state?.candidate || {
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: 'Senior Frontend Engineer',
    experience: 'Senior (5y+)'
  };

  const questions = MOCK_QUESTIONS[candidate.role] || MOCK_QUESTIONS['default'];

  // State Management
  const sessionId = location.state?.sessionId || '1';
  const { connectionStatus, latestMessage, sendMessage } = useWebSocket(sessionId);

  const [currentQuestion, setCurrentQuestion] = useState("Connecting to Stella AI...");
  const [questionTurn, setQuestionTurn] = useState(1);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 mins per question
  const [transcripts, setTranscripts] = useState([]);
  const [responseText, setResponseText] = useState('');
  const [isStellaSpeaking, setIsStellaSpeaking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);
  const videoRef = useRef(null);

  // Enable live webcam feed in meeting room
  useEffect(() => {
    let streamInstance = null;
    const enableWebcam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamInstance = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn("Webcam access not allowed or unavailable:", err);
      }
    };

    enableWebcam();

    return () => {
      if (streamInstance) {
        streamInstance.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize browser-calibrated speech recorder
  const {
    isRecording,
    audioBlob,
    text: recordedText,
    startRecording,
    stopRecording
  } = useAudioRecorder();

  // Handle server responses from live Llama3.1 Ollama WebSocket
  useEffect(() => {
    if (!latestMessage) return;

    if (latestMessage.type === 'question') {
      setCurrentQuestion(latestMessage.content);
      setQuestionTurn(latestMessage.turn || 1);
    } else if (latestMessage.type === 'evaluation') {
      setLastEvaluation({
        score: latestMessage.score,
        feedback: latestMessage.feedback
      });
    } else if (latestMessage.type === 'completed') {
      setIsSubmitting(true);
      setTimeout(() => {
        navigate(PATHS.REPORT, { state: { candidate, transcripts } });
      }, 1500);
    }
  }, [latestMessage]);

  // Watch for completed voice captures to transcribe using backend faster-whisper small model
  useEffect(() => {
    if (!audioBlob) return;

    const performTranscription = async () => {
      setIsSubmitting(true);
      try {
        const result = await interviewApi.transcribeAudio(audioBlob);
        setResponseText(result.text);
      } catch (err) {
        console.error("Transcription failed via backend service:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    performTranscription();
  }, [audioBlob]);

  // Stella real voice synthesis on mount / question transition using local Piper TTS
  useEffect(() => {
    if (currentQuestion === "Connecting to Stella AI...") return;

    setIsStellaSpeaking(true);
    let isCancelled = false;
    let audioInstance = null;
    let speakerTimer = null;

    const playQuestionAudio = async () => {
      try {
        const audioUrl = `${apiClient.defaults.baseURL}/interview/speak?text=${encodeURIComponent(currentQuestion)}`;
        
        audioInstance = new Audio(audioUrl);
        audioInstance.onended = () => {
          if (!isCancelled) setIsStellaSpeaking(false);
        };
        audioInstance.onerror = () => {
          if (!isCancelled) {
            console.warn("Speech synthesis play error. Using fallback timer.");
            speakerTimer = setTimeout(() => setIsStellaSpeaking(false), 4500);
          }
        };
        await audioInstance.play();
      } catch (err) {
        if (!isCancelled) {
          console.warn("Speech synthesis audio blocked or failed. Using fallback timer.", err);
          speakerTimer = setTimeout(() => setIsStellaSpeaking(false), 4500);
        }
      }
    };

    playQuestionAudio();

    // Reset and start timer
    setSecondsRemaining(120);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isCancelled = true;
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.onended = null;
        audioInstance.onerror = null;
      }
      if (speakerTimer) {
        clearTimeout(speakerTimer);
      }
      clearInterval(timerRef.current);
    };
  }, [currentQuestion]);

  // Handle Response Recording Toggle
  // Handle Response Recording Toggle via Browser MediaDevices
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setResponseText('');
      startRecording();
    }
  };

  // Submit Answer over Live WebSocket
  const handleAnswerSubmit = () => {
    if (!responseText.trim()) return;

    // Add to transcripts state to carry over to scorecard report
    setTranscripts(prev => [
      ...prev,
      { question: currentQuestion, answer: responseText }
    ]);

    // Send answer text payload over the live WebSocket to trigger Llama3.1 evaluation & transition nodes
    sendMessage('answer', { text: responseText });
    setResponseText('');
  };

  // Format Timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 bg-slate-900 text-blue-400 rounded-xl flex items-center justify-center font-bold border border-slate-800 mt-1 shadow-inner">
            <User size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
            <p className="text-xs text-slate-500 font-medium">{candidate.role} &bull; {candidate.experience}</p>
            {candidate.domain && <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1 border-t border-slate-100 pt-1">Domain: {candidate.domain}</p>}
            
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-md">
                {candidate.skills.slice(0, 5).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[9px] rounded font-bold">
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 5 && <span className="text-[9px] text-slate-400 font-bold">+{candidate.skills.length - 5} more</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Time Remaining</p>
            <p className={`text-md font-bold ${secondsRemaining < 20 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
              {formatTime(secondsRemaining)}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Question Progress</p>
            <p className="text-md font-bold text-slate-900">
              {questionTurn} of 5
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Stella AI Agent Block */}
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between min-h-[420px] shadow-lg">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isStellaSpeaking ? 'bg-blue-500 animate-ping' : 'bg-emerald-500'}`}></span>
              <p className="text-xs font-bold text-slate-300">Stella AI Presenter</p>
            </div>
            <span className="text-[10px] font-semibold uppercase bg-blue-900/30 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md">
              {isStellaSpeaking ? 'Stella is Speaking' : 'Listening...'}
            </span>
          </div>

          {/* AI Avatar Core */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="relative">
              {/* Outer wave ripples */}
              <div className={`absolute -inset-4 rounded-full bg-blue-500/10 blur-md transition-all duration-700
                ${isStellaSpeaking ? 'scale-125 opacity-100 animate-pulse' : 'scale-90 opacity-40'}
              `}></div>
              <div className="relative h-24 w-24 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/20 border-2 border-blue-400/30">
                <Sparkles size={40} className="text-white animate-pulse" />
              </div>
            </div>

            {/* Audio Waves Simulation */}
            {isStellaSpeaking ? (
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(6)].map((_, i) => (
                  <span 
                    key={i} 
                    className="w-1 bg-blue-400 rounded-full transition-all duration-300"
                    style={{ 
                      height: `${Math.floor(Math.random() * 24) + 8}px`,
                      animation: `pulse 1.2s infinite alternate`,
                      animationDelay: `${i * 0.15}s`
                    }}
                  ></span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-medium text-slate-400 italic">Stella is waiting for your vocal feedback...</p>
            )}

            {/* Current Question */}
            <div className="bg-slate-850/80 border border-slate-850 p-5 rounded-2xl max-w-md">
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                "{currentQuestion}"
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500">Autonomous audio stream processed through secure Stella API gateway.</p>
          </div>
        </div>

        {/* Right Column: Candidate Interaction Room */}
        <div className="space-y-6">
          {/* Real Live Webcam Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center relative">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/40 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">
                <Video size={12} className="text-red-500 animate-pulse" />
                <span>Live Camera Feed</span>
              </div>

              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />

              {isRecording && (
                <div className="absolute inset-0 bg-blue-950/35 backdrop-blur-[0.5px] flex items-center justify-center text-center p-4">
                  <div className="bg-slate-900/90 border border-slate-700/50 p-4 rounded-2xl max-w-xs space-y-2 shadow-2xl">
                    <Mic className="mx-auto text-blue-500 animate-bounce" size={24} />
                    <p className="text-xs font-bold text-white uppercase tracking-wider">Capturing Response...</p>
                    <p className="text-[10px] text-slate-400">Streaming vocal feed directly to Stella AI</p>
                  </div>
                </div>
              )}
            </div>

            {/* Micro Interaction Controls */}
            <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-white">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Calibrated Devices</p>
                <p className="text-[10px] text-slate-400">Microphone and Camera active</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleToggleRecording}
                  disabled={isStellaSpeaking}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer
                    ${isStellaSpeaking 
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                      : isRecording 
                        ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white shadow-md shadow-red-600/10' 
                        : 'bg-blue-600 hover:bg-blue-700 border-blue-500 text-white shadow-md shadow-blue-600/10'
                    }
                  `}
                >
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? 'Stop Recording' : 'Record response'}
                </button>
              </div>
            </div>
          </div>

          {/* Transcript Response Block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CornerDownLeft size={16} className="text-slate-400" />
                Live Response Transcript
              </h2>
              {responseText && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> Calibrated Speech
                </span>
              )}
            </div>

            {responseText ? (
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono">
                  {responseText}
                </p>
              </div>
            ) : isRecording ? (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
                <div className="flex items-center gap-1 justify-center h-4">
                  {[...Array(4)].map((_, i) => (
                    <span 
                      key={i} 
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></span>
                  ))}
                </div>
                <p className="text-xs text-slate-400">Transcribing voice input in real-time...</p>
              </div>
            ) : (
              <div className="p-4 border border-slate-150 rounded-xl bg-slate-50 text-center">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <AlertCircle size={14} className="text-slate-400" />
                  Your speech transcript will render here. Enable mic recording to talk.
                </p>
              </div>
            )}

            {responseText && (
              <button
                onClick={handleAnswerSubmit}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {isSubmitting ? 'Finalizing Evaluation...' : questionTurn === 5 ? 'Finish Interview' : 'Submit & Next Question'}
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
