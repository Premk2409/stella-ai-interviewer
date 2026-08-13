import React, { useState } from 'react';
import { UploadCloud, FileCheck, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { interviewApi } from '../services/interviewApi';

export default function ResumeUploader({ onSkillsExtracted, onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setResumeData(null);

    // Call REST endpoint to upload & parse skills
    const data = await interviewApi.uploadResume(file);
    setIsUploading(false);
    setResumeData(data);

    if (onSkillsExtracted) {
      onSkillsExtracted(data.extractedSkills);
    }
    if (onUploadComplete) {
      onUploadComplete(data);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider text-slate-400">
        Resume CV parsing
      </h3>

      {/* Upload Box Drop area */}
      {!resumeData && !isUploading && (
        <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center">
          <UploadCloud className="text-slate-400 mb-2" size={32} />
          <p className="text-xs font-bold text-slate-800">Upload your CV / Resume</p>
          <p className="text-[10px] text-slate-400 mt-1">PDF or DOCX (max. 5MB)</p>
          <input 
            type="file" 
            accept=".pdf,.docx,.doc" 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      )}

      {/* Loading state spinner */}
      {isUploading && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
          <Loader2 className="text-blue-600 animate-spin" size={32} />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-800 animate-pulse">Stella Parsing CV Engine active</p>
            <p className="text-[10px] text-slate-400">Extracting semantic developer profiles...</p>
          </div>
        </div>
      )}

      {/* Results Display extracted skills */}
      {resumeData && (
        <div className="space-y-4 animate-fade-in bg-slate-50 border border-slate-150 p-4 rounded-xl">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{resumeData.fileName}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Semantic Parse Complete</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Extracted technical skills</span>
              <span className="text-blue-600 flex items-center gap-1">
                <Sparkles size={10} /> {resumeData.confidenceScore}% parsing confidence
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {resumeData.extractedSkills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg shadow-sm"
                >
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <div className="text-right pt-1.5 border-t border-slate-200/40">
            <button
              onClick={() => setResumeData(null)}
              className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition"
            >
              Clear and re-upload CV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
