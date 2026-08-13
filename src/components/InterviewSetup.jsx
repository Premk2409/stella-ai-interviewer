import React, { useState } from 'react';
import { Briefcase, Clock, FileBadge, Award, ArrowRight } from 'lucide-react';

export default function InterviewSetup({ onStartInterview }) {
  const [formData, setFormData] = useState({
    role: 'Senior Frontend Engineer',
    experience: 'Senior (5y+)',
    type: 'Technical',
    duration: '30 mins',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onStartInterview) {
      onStartInterview(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider text-slate-400">
        Interview setup & calibration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Job Role Select */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Job Role Target
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Briefcase size={16} />
            </span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
              <option value="Backend Node/Java Engineer">Backend Node/Java Engineer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Experience Tier
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Award size={16} />
            </span>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="Junior (0-2y)">Junior (0-2y)</option>
              <option value="Mid-level (3-5y)">Mid-level (3-5y)</option>
              <option value="Senior (5y+)">Senior (5y+)</option>
            </select>
          </div>
        </div>

        {/* Interview Type Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Evaluation Type
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <FileBadge size={16} />
            </span>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="Technical">Technical Theory</option>
              <option value="Coding">Live Coding Analysis</option>
              <option value="System Design">System Design Architecture</option>
              <option value="HR">HR & Cultural Fit</option>
            </select>
          </div>
        </div>

        {/* Duration Configuration */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Session Duration Limit
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Clock size={16} />
            </span>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="15 mins">15 minutes (Express Screening)</option>
              <option value="30 mins">30 minutes (Standard Screening)</option>
              <option value="45 mins">45 minutes (Standard Evaluation)</option>
              <option value="60 mins">60 minutes (Deep Dive Architectural)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/15 transition-all active:scale-[0.98] cursor-pointer"
      >
        <span>Initialize Stella Interview Session</span>
        <ArrowRight size={14} />
      </button>
    </form>
  );
}
