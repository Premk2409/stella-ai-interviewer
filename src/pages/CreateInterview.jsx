import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Clock, 
  Calendar, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { PATHS } from '../utils/paths';
import ResumeUploader from '../components/ResumeUploader';
import { interviewApi } from '../services/interviewApi';

export default function CreateInterview() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_email: '',
    phone: '',
    job_role: '',
    interview_type: 'Technical',
    experience_level: 'Mid-level (3-5y)',
    duration: '5 mins',
    scheduled_date_time: '14-Aug-2026 10:00 AM',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Resume Drop/Select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Handle Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.candidate_name.trim()) newErrors.candidate_name = 'Candidate Name is required';
    if (!formData.candidate_email.trim()) newErrors.candidate_email = 'Candidate Email is required';
    if (!formData.job_role) newErrors.job_role = 'Please select a job role';
    if (!formData.scheduled_date_time) newErrors.scheduled_date_time = 'Scheduled Date/Time is required';
    if (!resumeFile) newErrors.resume = 'Please upload a PDF or DOCX resume';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setFeedback('');

    try {
      const data = new FormData();
      data.append('candidate_name', formData.candidate_name);
      data.append('candidate_email', formData.candidate_email);
      data.append('job_role', formData.job_role);
      data.append('interview_type', formData.interview_type);
      data.append('experience_level', formData.experience_level);
      data.append('scheduled_date_time', formData.scheduled_date_time);
      data.append('file', resumeFile);

      // Submit to backend
      await interviewApi.createScheduledInterview(data);
      setFeedback('Interview scheduled successfully and Resume intelligence profile extracted!');
      
      setTimeout(() => {
        navigate(PATHS.SCHEDULED);
      }, 1200);

    } catch (err) {
      console.error(err);
      setFeedback('Failed to schedule interview. Proceeding with simulated fallback.');
      
      // Local Storage simulated fallback
      const scheduledList = JSON.parse(localStorage.getItem('scheduled_interviews') || '[]');
      const newSimulated = {
        id: `local_${Date.now()}`,
        candidate_name: formData.candidate_name,
        candidate_email: formData.candidate_email,
        job_role: formData.job_role,
        interview_type: formData.interview_type,
        scheduled_date_time: formData.scheduled_date_time,
        status: 'SCHEDULED',
        context: {
          candidate_profile: {
            name: formData.candidate_name,
            role: formData.job_role,
            experience: formData.experience_level,
            skills: ['Java', 'Spring Boot', 'Kafka', 'React', 'TypeScript', 'Docker'].slice(0, 4),
            seniority: 'Senior'
          },
          technical_skills: ['Java', 'Spring Boot', 'Kafka'],
          projects: [],
          interview_strategy: {
            focus_areas: ['Language Core', 'Architecture Fundamentals', 'System Scaling'],
            difficulty_level: 'Senior',
            question_distribution: { 'Java': 30, 'Spring Boot': 40, 'System Design': 30 }
          },
          question_plan: [
            { category: 'Java Core', question_count: 3, difficulty: 'Senior' },
            { category: 'Spring Boot', question_count: 4, difficulty: 'Senior' },
            { category: 'System Design', question_count: 3, difficulty: 'Senior' }
          ]
        }
      };
      scheduledList.push(newSimulated);
      localStorage.setItem('scheduled_interviews', JSON.stringify(scheduledList));

      setTimeout(() => {
        navigate(PATHS.SCHEDULED);
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Schedule Technical Interview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload CV and trigger Resume Intelligence Context building for custom adaptive screening.
        </p>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl flex items-start gap-3 shadow-sm border
          ${feedback.includes('success') 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
          }
        `}>
          {feedback.includes('success') 
            ? <CheckCircle2 size={20} className="shrink-0 text-emerald-600 mt-0.5" />
            : <AlertCircle size={20} className="shrink-0 text-red-600 mt-0.5" />
          }
          <div>
            <p className="text-xs leading-relaxed font-bold">{feedback}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sparkles className="text-blue-500" size={18} />
          Interview Specifications
        </h2>

        {/* Candidate Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Candidate Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User size={16} />
            </span>
            <input
              type="text"
              name="candidate_name"
              value={formData.candidate_name}
              onChange={handleChange}
              placeholder="Sandeep Rao"
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
          {errors.candidate_name && <p className="text-red-600 text-xs mt-1">{errors.candidate_name}</p>}
        </div>

        {/* Candidate Email */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Candidate Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              name="candidate_email"
              value={formData.candidate_email}
              onChange={handleChange}
              placeholder="sandeep@example.com"
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
          {errors.candidate_email && <p className="text-red-600 text-xs mt-1">{errors.candidate_email}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone (Optional)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Phone size={16} />
            </span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Job Role Selection */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Targeted Job Profile</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Briefcase size={16} />
            </span>
            <select
              name="job_role"
              value={formData.job_role}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="">Select Target Profile Stack...</option>
              <option value="Java Developer">Java Developer</option>
              <option value="React Developer">React Developer</option>
              <option value="Python Developer">Python Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Engineer">Data Engineer</option>
            </select>
          </div>
          {errors.job_role && <p className="text-red-600 text-xs mt-1">{errors.job_role}</p>}
        </div>

        {/* Row fields: Date, Duration, Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Experience level */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Target Seniority</label>
            <select
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            >
              <option value="Junior (0-2y)">Junior (0-2y)</option>
              <option value="Mid-level (3-5y)">Mid-level (3-5y)</option>
              <option value="Senior (5y+)">Senior (5y+)</option>
              <option value="Lead/Principal">Lead/Principal (10y+)</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Interview Duration</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Clock size={16} />
              </span>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              >
                <option value="15 mins">15 mins</option>
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Scheduled Date/Time</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Calendar size={16} />
              </span>
              <input
                type="text"
                name="scheduled_date_time"
                value={formData.scheduled_date_time}
                onChange={handleChange}
                placeholder="14-Aug-2026 10:00 AM"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
            {errors.scheduled_date_time && <p className="text-red-600 text-xs mt-1">{errors.scheduled_date_time}</p>}
          </div>
        </div>

        {/* Resume File Upload Box */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">AI Resume Auto-Filler & Calibration</label>
          <ResumeUploader 
            onUploadComplete={(data) => {
              // Populate candidate profile details programmatically with true parsed values from local llama3.1:8b Ollama engine
              setFormData(prev => ({
                ...prev,
                candidate_name: data.name || prev.candidate_name,
                candidate_email: data.email || prev.candidate_email,
                job_role: data.role || prev.job_role,
                experience_level: data.experienceYears >= 5 
                  ? 'Senior (5y+)' 
                  : data.experienceYears >= 3 
                    ? 'Mid-level (3-5y)' 
                    : 'Junior (0-2y)'
              }));
              
              // Also keep track of the file reference for scheduling submission
              if (data.file) {
                setResumeFile(data.file);
              }
            }}
          />
          {errors.resume && <p className="text-red-600 text-xs mt-1">{errors.resume}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/15 active:scale-[0.98] transition cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing CV with Llama3.1 and Generating Strategy...</span>
            </>
          ) : (
            <span>Schedule and Create Interview Context</span>
          )}
        </button>
      </form>
    </div>
  );
}
