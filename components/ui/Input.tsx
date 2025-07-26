import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 disabled:bg-gray-800 ${className || ''}`}
      {...props}
    />
  );
};