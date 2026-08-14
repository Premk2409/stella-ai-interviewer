import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  CheckCircle2, 
  Calendar, 
  User, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Briefcase,
  Play,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { PATHS } from '../utils/paths';
import { interviewApi } from '../services/interviewApi';

export default function ScheduledInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
  const [error, setError] = useState('');

  // Fetch Scheduled Interviews
  useEffect(() => {
    const loadScheduledData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await interviewApi.getScheduledInterviews();
        
        // Merge with any local mock data in localStorage
        const localList = JSON.parse(localStorage.getItem('scheduled_interviews') || '[]');
        setInterviews([...localList, ...response]);
      } catch (err) {
        console.warn("REST API failed. Using local storage mock dataset.");
        const localList = JSON.parse(localStorage.getItem('scheduled_interviews') || '[]');
        if (localList.length === 0) {
          // Initialize mock database entries for visual testing
          const defaultMocks = [
            { 
              id: '1', 
              candidate_name: 'Sandeep Rao', 
              candidate_email: 'sandeep@test.com', 
              job_role: 'Senior Backend Java Developer', 
              scheduled_date_time: '14-Aug-2026 10:00 AM', 
              status: 'SCHEDULED',
              experience: '5 Years',
              skills: ['Java', 'Spring Boot', 'Kafka', 'AWS', 'PostgreSQL']
            },
            { 
              id: '2', 
              candidate_name: 'Arjun Mehta', 
              candidate_email: 'arjun@react.com', 
              job_role: 'React Developer', 
              scheduled_date_time: '15-Aug-2026 02:30 PM', 
              status: 'SCHEDULED',
              experience: '3 Years',
              skills: ['React Hooks', 'JavaScript', 'Redux', 'Tailwind']
            },
            { 
              id: '3', 
              candidate_name: 'Sarah Jenkins', 
              candidate_email: 'sarah@example.com', 
              job_role: 'Senior Frontend Engineer', 
              scheduled_date_time: 'Today, 2:30 PM', 
              status: 'COMPLETED',
              experience: '7 Years',
              skills: ['React', 'Zustand', 'Vite', 'WebSockets']
            }
          ];
          localStorage.setItem('scheduled_interviews', JSON.stringify(defaultMocks));
          setInterviews(defaultMocks);
        } else {
          setInterviews(localList);
        }
      } finally {
        setLoading(false);
      }
    };

    loadScheduledData();
  }, []);

  // Filter scheduled sessions
  const filteredInterviews = interviews.filter(item => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  // Start Interview Flow: Fetches context and loads room
  const handleStartInterview = async (interviewId) => {
    try {
      setLoading(true);
      
      // Update status to IN_PROGRESS in local UI state
      setInterviews(prev => prev.map(item => 
        item.id === interviewId ? { ...item, status: 'IN_PROGRESS' } : item
      ));

      // Attempt to load context from DB
      let contextData = null;
      if (typeof interviewId === 'string' && interviewId.startsWith('local_')) {
        // Retrieve local mock context
        const localList = JSON.parse(localStorage.getItem('scheduled_interviews') || '[]');
        const found = localList.find(i => i.id === interviewId);
        contextData = found?.context;
      } else {
        contextData = await interviewApi.getInterviewContext(interviewId);
      }

      // Navigate to Dynamic Interview Room and pass context details in route state
      navigate(`/interview-room/${interviewId}`, { 
        state: { 
          candidate: {
            name: contextData?.candidate_profile?.name || 'Candidate',
            role: contextData?.candidate_profile?.role || 'Engineer',
            experience: contextData?.candidate_profile?.experience || '3 years',
            skills: contextData?.technical_skills || [],
            projects: contextData?.projects || [],
            question_plan: contextData?.question_plan || []
          },
          sessionId: interviewId
        } 
      });

    } catch (err) {
      console.error("Context fetch failed. Defaulting to safe room loader.", err);
      // Construct fallback profile
      const target = interviews.find(i => i.id === interviewId) || {};
      navigate(`/interview-room/${interviewId}`, {
        state: {
          candidate: {
            name: target.candidate_name || 'Candidate',
            role: target.job_role || 'Developer',
            experience: target.experience || '5 Years',
            skills: target.skills || ['Java', 'Spring Boot', 'Kafka'],
            projects: [],
            question_plan: [
              { category: 'General', question_count: 5, difficulty: 'Senior' }
            ]
          },
          sessionId: interviewId
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Scheduled Interviews</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage upcoming autonomous screenings, inspect extracted Resume Contexts, and start live meetings.
          </p>
        </div>
        <button
          onClick={() => navigate(PATHS.CREATE)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/10 active:scale-[0.98] transition cursor-pointer"
        >
          Schedule New Interview
        </button>
      </div>

      {/* Filter Tabs & Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          {[
            { label: 'All Interviews', value: 'ALL' },
            { label: 'Upcoming', value: 'SCHEDULED' },
            { label: 'In Progress', value: 'IN_PROGRESS' },
            { label: 'Completed', value: 'COMPLETED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                ${filter === tab.value 
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
          <SlidersHorizontal size={14} />
          <span>Showing {filteredInterviews.length} entries</span>
        </div>
      </div>

      {/* Main Table Card */}
      {loading && interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
          <p className="text-sm font-semibold text-slate-700">Loading scheduled interviews...</p>
        </div>
      ) : error ? (
        <div className="p-5 text-center bg-red-50 border border-red-200 text-red-800 rounded-2xl">
          <AlertCircle size={28} className="mx-auto text-red-600 mb-2 animate-bounce" />
          <p className="text-xs font-bold">{error}</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Briefcase className="text-slate-300 mb-2" size={36} />
          <p className="text-xs font-semibold text-slate-500 italic">No scheduled interviews match the current filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Name</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Role</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Detected</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredInterviews.map((item) => (
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
                      <p className="text-[10px] text-slate-400">Exp: {item.experience || '3-5y'}</p>
                    </td>
                    {/* Skills */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(item.skills || ['Java', 'Spring Boot', 'Kafka']).slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-blue-50/50 text-blue-700 border border-blue-100/30 text-[9px] rounded font-bold">
                            {skill}
                          </span>
                        ))}
                        {(item.skills || []).length > 3 && <span className="text-[9px] text-slate-400 font-bold">+{item.skills.length - 3}</span>}
                      </div>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        {item.scheduled_date_time}
                      </p>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider
                        ${item.status === 'COMPLETED' 
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-700' 
                          : item.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 border-blue-150 text-blue-700 animate-pulse'
                            : 'bg-amber-50 border-amber-150 text-amber-700'
                        }
                      `}>
                        {item.status}
                      </span>
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {item.status === 'COMPLETED' ? (
                        <button
                          onClick={() => navigate(PATHS.REPORT, { state: { candidate: { name: item.candidate_name, role: item.job_role, experience: item.experience || '5y' } } })}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          View Report
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartInterview(item.id)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-600/10 active:scale-[0.98] transition cursor-pointer"
                        >
                          <Play size={10} fill="currentColor" />
                          <span>Start Interview</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
