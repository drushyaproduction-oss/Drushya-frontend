import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title, toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 md:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="mr-4 lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight truncate">{title}</h1>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        {/* Profile Trigger */}
        <div 
          className="flex items-center space-x-5 cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-right hidden md:block">
            <span className="block text-gray-900 font-bold text-sm group-hover:text-yellow-600 transition-colors">System Admin</span>
            <span className="block text-gray-500 text-xs">admin@drushya.com</span>
          </div>
          <div className="w-11 h-11 bg-gradient-to-tr from-yellow-400 to-yellow-300 rounded-full shadow-md flex items-center justify-center font-bold text-gray-900 text-lg group-hover:shadow-lg transition-all border-2 border-white transform group-hover:scale-105">
            A
          </div>
        </div>

        {/* Dropdown Popup */}
        <div className={`absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-900">System Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@drushya.com</p>
          </div>
          <div className="p-2">
            <Link 
              to="/login"
              className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
