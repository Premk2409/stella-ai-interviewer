import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  className = '' 
}) {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] outline-none duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10 focus:ring-2 focus:ring-blue-100 border border-blue-500",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-slate-100",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 focus:ring-2 focus:ring-red-100 border border-red-500",
    navy: "bg-slate-900 hover:bg-slate-850 text-white shadow-md shadow-slate-900/10 focus:ring-2 focus:ring-slate-200 border border-slate-800"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
