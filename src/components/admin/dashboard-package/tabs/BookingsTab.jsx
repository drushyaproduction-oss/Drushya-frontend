import React from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

const BookingsTab = ({ modalMode, formData, setFormData }) => {

  const handleStatusChange = (bookingId, newStatus) => {
    setFormData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      )
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-2">
        <h4 className="text-sm font-bold text-gray-800 mb-1">Package Bookings</h4>
        <p className="text-xs text-gray-500">Manage clients who have booked this specific package.</p>
      </div>

      <div className="flex flex-col gap-3">
        {formData.bookings && formData.bookings.length > 0 ? (
          formData.bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <FiUser size={14} />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{booking.clientName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 ml-1">
                  <FiCalendar size={12} />
                  <span>{booking.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {modalMode !== 'view' ? (
                  <select 
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none text-center ${getStatusColor(booking.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            No bookings found for this package.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookingsTab;
