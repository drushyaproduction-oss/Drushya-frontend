import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { FiX } from 'react-icons/fi';

const RightSideModal = ({ visible, onHide, title, children, className = '', style = {} }) => {
  const customHeader = (
    <div className="flex justify-between items-center w-full pr-2">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <button 
        onClick={onHide}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none cursor-pointer"
        aria-label="Close"
      >
        <FiX size={24} />
      </button>
    </div>
  );

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      showCloseIcon={false}
      className={`bg-white !m-4 !h-[calc(100vh-2rem)] !rounded-2xl shadow-2xl overflow-hidden ${className ? className : 'w-full sm:w-[35rem]'}`}
      style={style}
      pt={{
        root: { className: 'bg-white flex flex-col' },
        header: { className: 'bg-white border-b border-gray-100 p-4 w-full flex' },
        content: { className: 'bg-white p-0 overflow-y-auto flex-1' },
        mask: { className: 'bg-black/40 backdrop-blur-sm' }
      }}
      header={customHeader}
    >
      <div className="p-5 pb-8 bg-white min-h-full">
        {children}
      </div>
    </Sidebar>
  );
};

export default RightSideModal;
