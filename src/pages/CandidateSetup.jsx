import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Briefcase, 
  Video, 
  Mic, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { PATHS } from '../utils/paths';

export default function CandidateSetup() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
  });

  // Validation / Error States
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Hardware Checks State (simulated toggles)
  const [hardware, setHardware] = useState({
    micActive: false,
    camActive: false,
    micTesting: false,
    camTesting: false,
  });

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
  };

  // Toggle Camera State Simulation
  const toggleCamera = () => {
    setHardware(prev => ({ ...prev, camTesting: true }));
    setTimeout(() => {
      setHardware(prev => ({ ...prev, camTesting: false, camActive: !prev.camActive }));
    }, 600);
  };

  // Toggle Microphone State Simulation
  const toggleMic = () => {
    setHardware(prev => ({ ...prev, micTesting: true }));
    setTimeout(() => {
      setHardware(prev => ({ ...prev, micTesting: false, micActive: !prev.micActive }));
    }, 600);
  };

  // Form Submission & Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.role) newErrors.role = 'Please select a job role';
    if (!formData.experience) newErrors.experience = 'Please select your experience level';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError('Please fix the validation errors in the form before proceeding.');
      return;
    }

    // Check if camera and mic are active
    if (!hardware.micActive || !hardware.camActive) {
      setSubmitError('System hardware checks incomplete. Please enable both camera and microphone to begin the AI interview.');
      return;
    }

    // Success - Go to interview room
    navigate(PATHS.INTERVIEW, { state: { candidate: formData } });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">Candidate Setup Room</h1>
        <p className="text-slate-500 text-sm mt-1">
          Complete your profile and calibrate your audio/video devices for Stella AI.
        </p>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-shake">
          <AlertCircle size={20} className="shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Registration Alert</p>
            <p className="text-xs leading-relaxed text-red-600">{submitError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Profile Details Card */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Candidate Information
          </h2>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
                  ${errors.name 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'
                  }
                `}
              />
            </div>
            {errors.name && <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium"><AlertCircle size={12} /> {errors.name}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all
                  ${errors.email 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'
                  }
                `}
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium"><AlertCircle size={12} /> {errors.email}</p>}
          </div>

          {/* Job Role Selection */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Targeted Role
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Briefcase size={16} />
              </span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none appearance-none transition-all
                  ${errors.role 
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100 focus:border-red-500' 
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500'
                  }
                `}
              >
                <option value="">Select a role...</option>
                <option value="Senior Frontend Engineer">Senior Frontend Engineer</option>
                <option value="Backend Java Engineer">Backend Node/Java Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>
            {errors.role && <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium"><AlertCircle size={12} /> {errors.role}</p>}
          </div>

          {/* Experience Level */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Junior (0-2y)', 'Mid-level (3-5y)', 'Senior (5y+)'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, experience: level }));
                    setErrors(prev => ({ ...prev, experience: '' }));
                  }}
                  className={`border px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all
                    ${formData.experience === level 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' 
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
            {errors.experience && <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium"><AlertCircle size={12} /> {errors.experience}</p>}
          </div>

          {/* Resume Upload Placeholder */}
          <div className="space-y-1 pt-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Resume Upload (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition">
              <UploadCloud className="mx-auto text-slate-400 mb-1.5" size={24} />
              <p className="text-xs font-bold text-slate-800">Click to upload your CV</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PDF or DOCX (max. 5MB)</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/15 transition-all active:scale-[0.98] cursor-pointer"
          >
            Submit and Enter Interview
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Hardware Calibrations Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-md font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. System Verification Check
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We require access to your webcam and microphone to simulate real-time conversational analysis.
            </p>

            {/* Video Calibration Block */}
            <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50">
              <div className="aspect-video w-full relative bg-slate-950 flex items-center justify-center text-slate-500">
                {hardware.camActive ? (
                  <div className="absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center text-center p-4">
                    <Video size={36} className="text-blue-500 animate-pulse" />
                    <p className="text-xs font-bold text-white mt-2">Active Camera Stream Simulation</p>
                    <p className="text-[10px] text-slate-400">Rendering frame buffers locally</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Video size={28} className="mx-auto text-slate-600 mb-1" />
                    <p className="text-xs font-bold text-slate-400">Camera Feed Offline</p>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Webcam Calibrate
                    {hardware.camActive && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </p>
                  <p className="text-[10px] text-slate-400">Verify video resolution is HD</p>
                </div>
                <button
                  type="button"
                  onClick={toggleCamera}
                  disabled={hardware.camTesting}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition
                    ${hardware.camActive 
                      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' 
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }
                  `}
                >
                  {hardware.camTesting ? 'Calibrating...' : hardware.camActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>

            {/* Audio Calibration Block */}
            <div className="border border-slate-150 rounded-xl p-4 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    Microphone Input
                    {hardware.micActive && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </p>
                  <p className="text-[10px] text-slate-400">Test volume decibel peaks</p>
                </div>
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={hardware.micTesting}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition
                    ${hardware.micActive 
                      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' 
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }
                  `}
                >
                  {hardware.micTesting ? 'Testing...' : hardware.micActive ? 'Disable' : 'Enable'}
                </button>
              </div>

              {hardware.micActive && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Mic size={14} className="text-blue-600 animate-bounce" />
                    <span className="text-[10px] font-bold text-blue-600">Simulated Audio Level Input: Good</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                    <div className="h-full bg-blue-500 w-1/4 rounded-sm"></div>
                    <div className="h-full bg-blue-500 w-1/5 rounded-sm"></div>
                    <div className="h-full bg-blue-500 w-1/6 rounded-sm"></div>
                    <div className="h-full bg-emerald-500 w-1/12 rounded-sm"></div>
                    <div className="h-full bg-slate-300 w-1/12 rounded-sm"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
