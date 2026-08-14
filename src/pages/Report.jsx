import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Loader2,
  Calendar,
  Briefcase
} from 'lucide-react';
import { PATHS } from '../utils/paths';
import { interviewApi } from '../services/interviewApi';

export default function Report() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedScore, setSelectedScore] = useState('ALL');

  // Fetch History on Mount
  useEffect(() => {
    const loadHistoryData = async () => {
      setLoading(true);
      try {
        let response = [];
        try {
          response = await interviewApi.getScheduledInterviews();
        } catch (e) {
          response = [];
        }

        // Filter and get completed interviews
        const completedFromApi = response.filter(i => i.status === 'COMPLETED').map(i => ({
          id: i.id,
          candidate_name: i.candidate_name,
          candidate_email: i.candidate_email,
          job_role: i.job_role,
          experience: i.experience || '5 Years',
          date: i.scheduled_date_time || '14-Aug-2026',
          duration: '45 mins',
          score: 85,
          status: 'COMPLETED'
        }));

        // Merge with any local mock data in localStorage
        const localList = JSON.parse(localStorage.getItem('scheduled_interviews') || '[]');
        const completedFromLocal = localList.filter(i => i.status === 'COMPLETED').map(i => ({
          id: i.id,
          candidate_name: i.candidate_name,
          candidate_email: i.candidate_email,
          job_role: i.job_role,
          experience: i.experience || '5 Years',
          date: i.scheduled_date_time || '14-Aug-2026',
          duration: '30 mins',
          score: 82,
          status: 'COMPLETED'
        }));

        const merged = [...completedFromLocal, ...completedFromApi];
        
        if (merged.length === 0) {
          // Default completed seed history
          const defaultHistory = [
            { id: 'h_1', candidate_name: 'Sandeep Rao', candidate_email: 'sandeep@test.com', job_role: 'Senior Java Developer', experience: '5 Years', date: '14-Aug-2026', duration: '45 mins', score: 85, status: 'COMPLETED' },
            { id: 'h_2', candidate_name: 'Arjun Mehta', candidate_email: 'arjun@react.com', job_role: 'React Developer', experience: '3 Years', date: '15-Aug-2026', duration: '30 mins', score: 80, status: 'COMPLETED' },
            { id: 'h_3', candidate_name: 'Sarah Jenkins', candidate_email: 'sarah@example.com', job_role: 'Senior Frontend Engineer', experience: '7 Years', date: 'Today, 2:30 PM', duration: '45 mins', score: 91, status: 'COMPLETED' }
          ];
          setHistory(defaultHistory);
        } else {
          setHistory(merged);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistoryData();
  }, []);

  // Filter & Search logic
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || item.job_role.includes(selectedRole);
    
    let matchesScore = true;
    if (selectedScore !== 'ALL') {
      if (selectedScore === 'HIGH') matchesScore = item.score >= 85;
      if (selectedScore === 'MID') matchesScore = item.score >= 75 && item.score < 85;
      if (selectedScore === 'LOW') matchesScore = item.score < 75;
    }

    return matchesSearch && matchesRole && matchesScore;
  });

  // Calculate Hiring Metrics
  const totalCompleted = history.length;
  const avgScore = totalCompleted > 0 ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / totalCompleted) : 0;
  const topSkill = "Spring Boot / React 19";
  const avgRating = "85.2% (Strong Hire)";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
        <p className="text-sm font-bold text-slate-800">Loading Completed Interview History...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Interview Reports Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor completed technical screenings, inspect AI-generated scorecards, and extract hiring analytics.
        </p>
      </div>

      {/* Analytics Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Interviews */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-inner">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed Screenings</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{totalCompleted}</p>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold shadow-inner">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Match Score</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{avgScore}%</p>
          </div>
        </div>

        {/* Top Skill */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 col-span-1 sm:col-span-1 lg:col-span-2">
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold shadow-inner">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hiring Trend Focus</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{topSkill}</p>
          </div>
        </div>
      </div>

      {/* Visual Score Trend Analytics */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          Technical Skill Performance & Score Trends
        </h2>
        
        {/* Simple Simulated Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Skill Performance List */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-700">Top Performing Topic Domains</p>
            <div className="space-y-3.5">
              {[
                { label: "Java & Spring Boot Core Concepts", val: 88, color: "bg-blue-600" },
                { label: "React 19 & Concurrent State Management", val: 92, color: "bg-purple-600" },
                { label: "Kafka Events & Microservice Boundaries", val: 74, color: "bg-amber-600" }
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Distribution */}
          <div className="border border-slate-150 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
            <p className="text-xs font-bold text-slate-700">Hiring Funnel Distribution</p>
            <div className="flex items-end justify-around h-24 pt-4">
              {[
                { label: "Proceed", pct: 60, col: "bg-emerald-500" },
                { label: "Consider", pct: 30, col: "bg-amber-500" },
                { label: "Reject", pct: 10, col: "bg-red-400" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 w-1/4">
                  <span className="text-[10px] font-bold text-slate-800">{item.pct}%</span>
                  <div className={`w-6 rounded-t-md ${item.col}`} style={{ height: `${item.pct}px` }}></div>
                  <span className="text-[9px] font-semibold text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-2">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate by name..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          >
            <option value="ALL">All Roles</option>
            <option value="Java">Java Developers</option>
            <option value="React">React Developers</option>
            <option value="Frontend">Frontend Engineers</option>
          </select>

          {/* Score Filter */}
          <select
            value={selectedScore}
            onChange={(e) => setSelectedScore(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
          >
            <option value="ALL">All Scores</option>
            <option value="HIGH">Score &ge; 85%</option>
            <option value="MID">Score 75% - 84%</option>
            <option value="LOW">Score &lt; 75%</option>
          </select>
        </div>
      </div>

      {/* History table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Interview Date</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Score</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition">
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-xs shadow-inner">
                        {item.candidate_name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.candidate_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.candidate_email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-semibold text-slate-800">{item.job_role}</p>
                    <p className="text-[10px] text-slate-400">Exp: {item.experience}</p>
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      {item.date}
                    </p>
                  </td>
                  {/* Duration */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                    {item.duration}
                  </td>
                  {/* Score */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/40">
                      {item.score}%
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider bg-emerald-50 border-emerald-150 text-emerald-700">
                      {item.status}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate(`/interview-report/${item.id}`)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer"
                    >
                      <span>View Report</span>
                      <ArrowRight size={10} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
