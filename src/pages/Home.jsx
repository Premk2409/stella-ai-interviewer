import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Video, 
  FileCheck, 
  ArrowRight, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { PATHS } from '../utils/paths';

export default function Home() {
  const stats = [
    { name: 'Total Interviews', value: '142', icon: Video, color: 'text-blue-600 bg-blue-50' },
    { name: 'Completed Evaluations', value: '128', icon: FileCheck, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Active Candidates', value: '14', icon: Users, color: 'text-purple-600 bg-purple-50' },
  ];

  const recentInterviews = [
    { name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', date: 'Today, 2:30 PM', status: 'Completed', score: '92/100' },
    { name: 'Michael Chen', role: 'Full Stack Developer', date: 'Today, 11:00 AM', status: 'Completed', score: '84/100' },
    { name: 'Emily Rodriguez', role: 'Product Manager', date: 'Yesterday', status: 'In Review', score: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-blue-600/10 to-transparent pointer-events-none"></div>
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-400/20 text-blue-400 rounded-full text-xs font-semibold">
            <Sparkles size={14} />
            Autonomous AI Recruitment
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Next-gen AI screening for technical talent
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to Stella AI. Conduct seamless conversational interviews, gauge technical depth, and generate comprehensive scorecard feedback in real-time.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link 
              to={PATHS.SETUP} 
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/15 transition-all active:scale-[0.98]"
            >
              Start New Interview
              <ArrowRight size={16} />
            </Link>
            <Link 
              to={PATHS.REPORT} 
              className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition"
            >
              View Analytics Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3.5 rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-[11px] text-slate-500">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="font-semibold text-emerald-500">+12%</span>
                <span>since last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Interviews and Action Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Interviews Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              Recent Interview Evaluations
            </h2>
            <Link to={PATHS.REPORT} className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentInterviews.map((item, idx) => (
              <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role} &bull; {item.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold
                    ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}
                  `}>
                    {item.status}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{item.score}</p>
                    <p className="text-[10px] text-slate-400">Scorecard</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stella AI Feature Highlights */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            How Stella AI Works
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                1
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Configure Role Details</p>
                <p className="text-xs text-slate-500">Provide candidate details and select technical stacks to customize the interview scope.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                2
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Conduct Live Interactive Sessions</p>
                <p className="text-xs text-slate-500">Stella uses voice, code-editor analysis, and follow-ups to gauge actual conceptual depth.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                3
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">Get Instant Scorecard Reports</p>
                <p className="text-xs text-slate-500">Receive precise scorecards breaking down structural thinking, style, and communication.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500">Ready to start candidate onboarding?</p>
              <Link 
                to={PATHS.SETUP} 
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group"
              >
                Go to Candidate Setup
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
