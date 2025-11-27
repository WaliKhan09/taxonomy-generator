import React from 'react';

export default function Input({ label, value, onChange, placeholder, helpText, type = "text", ...props }) {
    return (
        <div className="mb-4">
            {label && <label className="block mb-1 font-semibold text-sm text-slate-700">{label}</label>}
            <input
                type={type}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                {...props}
            />
            {helpText && <small className="block mt-1 text-xs text-slate-500">{helpText}</small>}
        </div>
    );
}
