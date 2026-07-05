import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiMoreVertical, FiEye, FiEdit, FiTrash2, FiMail } from 'react-icons/fi';

const ActionMenu = ({ onView, onEdit, onDelete, onSendEmail, onTrending, isTrending, position = 'bottom' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      const rect = menuRef.current.getBoundingClientRect();
      // Calculate top and left based on viewport (fixed position)
      const left = rect.right - 176; // 176px is w-44 width
      const top = position === 'top' ? rect.top : rect.bottom;
      setMenuPos({ top, left });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close if clicking outside the button AND outside the dropdown portal
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = (event) => {
      // Close menu if scrolling occurs anywhere to prevent floating detached menu
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true); // true for capture phase to catch all scrolls
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const dropdownMenu = isOpen ? (
    <div 
      ref={dropdownRef}
      style={{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }}
      className={`fixed w-44 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 z-[99999] overflow-hidden py-1 ${position === 'top' ? '-translate-y-full mb-1' : 'mt-1'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {onView && (
        <button 
          onClick={() => { setIsOpen(false); onView(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
        >
          <FiEye size={16} className="text-blue-500" /> View
        </button>
      )}
      {onEdit && (
        <button 
          onClick={() => { setIsOpen(false); onEdit(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
        >
          <FiEdit size={16} className="text-yellow-500" /> Edit
        </button>
      )}
      {onTrending && (
        <button 
          onClick={() => { setIsOpen(false); onTrending(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition-colors text-left cursor-pointer"
        >
          <i className={`pi ${isTrending ? 'pi-star-fill' : 'pi-star'} text-green-500`} style={{ fontSize: '1rem' }}></i> {isTrending ? 'Remove Trending' : 'Add to Trending'}
        </button>
      )}
      {onSendEmail && (
        <button 
          onClick={() => { setIsOpen(false); onSendEmail(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer"
        >
          <FiMail size={16} className="text-purple-500" /> Send Email
        </button>
      )}
      {onDelete && (
        <button 
          onClick={() => { setIsOpen(false); onDelete(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
        >
          <FiTrash2 size={16} className="text-red-500" /> Delete
        </button>
      )}
    </div>
  ) : null;

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button 
        onClick={toggleMenu}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-full transition-colors focus:outline-none cursor-pointer"
        title="More Actions"
      >
        <FiMoreVertical size={20} />
      </button>

      {/* Render the dropdown in the document body so it escapes all overflow hidden containers */}
      {isOpen && createPortal(dropdownMenu, document.body)}
    </div>
  );
};

export default ActionMenu;
