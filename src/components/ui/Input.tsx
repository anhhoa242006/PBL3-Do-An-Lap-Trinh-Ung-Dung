import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <input
          id={inputId}
          {...props}
          className={[
            'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
            'placeholder:text-gray-400',
            icon ? 'pl-9' : '',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
