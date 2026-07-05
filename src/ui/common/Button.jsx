import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  to, 
  href, 
  type = "button", 
  onClick, 
  variant = "primary", 
  className = "",
  fullWidth = false 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-md hover:shadow-lg rounded-lg px-8 py-3 active:scale-[0.98]",
    secondary: "bg-[#303030] hover:bg-black text-white shadow-md hover:shadow-lg rounded-lg px-8 py-3 active:scale-[0.98]",
    outline: "bg-transparent border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-gray-900 rounded-lg px-8 py-3 active:scale-[0.98]",
    pill: "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg hover:shadow-xl rounded-full px-10 py-4 tracking-wide transform hover:-translate-y-1"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseClasses} ${variants[variant]} ${widthClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
