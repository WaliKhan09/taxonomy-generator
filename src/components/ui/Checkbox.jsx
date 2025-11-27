import React from 'react';

export default function Checkbox({ label, checked, onChange, helpText, ...props }) {
    const isChecked = checked === 'yes' || checked === true || checked === 'on';
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-600"
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked ? 'yes' : 'no')}
                    {...props}
                />
                <label className="text-sm text-slate-700 cursor-pointer select-none" onClick={() => onChange(isChecked ? 'no' : 'yes')}>
                    {label}
                </label>
            </div>
            {helpText && <small className="block mt-1 text-xs text-slate-500 ml-6">{helpText}</small>}
        </div>
    );
}
