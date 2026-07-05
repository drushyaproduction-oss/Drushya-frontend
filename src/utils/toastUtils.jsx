import React from 'react';
import toast from 'react-hot-toast';

export const confirmDelete = (onConfirm, message = "Are you sure you want to delete this item?") => {
  toast((t) => (
    <div>
      <p className="mb-3 font-semibold text-gray-800">{message}</p>
      <div className="flex gap-2 justify-end">
        <button 
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium transition-colors cursor-pointer"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
        <button 
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors cursor-pointer"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ), { duration: Infinity, position: 'top-center' });
};
