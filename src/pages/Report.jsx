import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  TrendingUp, 
  User, 
  CornerDownRight, 
  Printer, 
  Share2 
} from 'lucide-react';
import { PATHS } from '../utils/paths';

export default function Report() {
  const location = useLocation();

  const mockTranscripts = [
    {
      question: "Could you describe your experience with modern performance optimization in React 19? What strategies do you use for high-volume state re-renders?",
      answer: "In my previous roles, I focused heavily on bundle splitting and rendering pathways. For state management, I prefer Zustand because of its light footprint and simple subscription mechanism. We avoided wasteful global states and utilized localized state partitions combined with React 19's concurrent features."
    },
    {
      question: "How do you design a reusable component library, and what is your architectural approach to state management (Zustand, Redux, Context API)?",
      answer: "I approach components through pure presentational interfaces wrapped in containers or hooks. That keeps testing very clean and limits side effects. The component styles must strictly adhere to style directives using utility selectors."
    },
    {
      question: "Explain how you would implement structural error boundaries, offline support, and API polling mechanisms in a production React dashboard.",
      answer: "Error boundaries are critical. I design high-level boundary limits to catch exceptions, then translate technical stack traces into readable messages on the screen, adhering to brand color codes to maintain system aesthetic consistency."
    }
  ];

  const candidate = location.state?.candidate || {
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    role: 'Senior Frontend Engineer',
    experience: 'Senior (5y+)'
  };

  const transcripts = location.state?.transcripts || mockTranscripts;

  const scorecards = [
    { name: 'Technical & Conceptual Depth', score: 92, feedback: 'Strong grasp of concurrent rendering paradigms and performance vectors.' },
    { name: 'Problem Solving & Structure', score: 88, feedback: 'Highly structured component-driven breakdown and separation of concerns.' },
    { name: 'Communication & Delivery', score: 94, feedback: 'Delivered ideas with great clarity, logical flow, and precision.' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link to={PATHS.HOME} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Stella Evaluation Scorecard</h1>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white text-xs font-bold rounded-xl transition cursor-pointer">
            <Printer size={14} />
            Export PDF
          </button>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/10 transition cursor-pointer">
            <Share2 size={14} />
            Share Report
          </button>
        </div>
      </div>

      {/* Profile Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center font-bold">
            <User size={24} />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-slate-900">{candidate.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{candidate.role} &bull; {candidate.experience}</p>
            <p className="text-[11px] text-slate-400">{candidate.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Stella Recommendation</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold mt-1 shadow-sm">
              <Award size={14} />
              Strong Hire
            </span>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden md:block"></div>
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Overall Rating</p>
            <p className="text-2xl font-black text-slate-900 mt-1">91.3%</p>
          </div>
        </div>
      </div>

      {/* Scorecards breakdown and AI summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scorecard Metrics Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
              Performance Scores
            </h3>

            <div className="space-y-6">
              {scorecards.map((card, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800">{card.name}</p>
                    <p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{card.score}%</p>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-550"
                      style={{ width: `${card.score}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed italic">{card.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Summaries */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
              Conversational Transcripts & Answers
            </h3>

            <div className="space-y-6 divide-y divide-slate-100">
              {transcripts.map((item, idx) => (
                <div key={idx} className={`space-y-2.5 ${idx > 0 ? 'pt-6' : ''}`}>
                  <p className="text-xs font-bold text-slate-900 flex items-start gap-1.5 leading-relaxed">
                    <CornerDownRight size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    Q{idx+1}: {item.question}
                  </p>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-mono">
                      "{item.answer}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stella AI Evaluation Overview */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-5 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <TrendingUp size={16} />
              Stella AI Synthesizer
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The candidate demonstrated superb capabilities. Sarah is highly proficient with React's latest architecture, exhibiting precise modular layout formulation. Her response delivery exhibits great leadership capabilities.
            </p>

            <div className="h-px bg-slate-800"></div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Key Strengths</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  Strong command of React state re-renders.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  Superb architectural separation in libraries.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  Clean error boundaries validation implementation.
                </li>
              </ul>
            </div>

            <div className="h-px bg-slate-800"></div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Opportunities for Growth</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  Could detail advanced server-side polling setups.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
