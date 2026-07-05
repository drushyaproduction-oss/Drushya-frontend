import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import { LuCalendar, LuMessageCircle, LuCamera, LuArrowRight, LuClock, LuCheck, LuX } from 'react-icons/lu';
import { getAllBookingRequests } from '../../../api/booking';
import { fetchContactsApi } from '../../../api/contact';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingInquiries: 0,
    completedShoots: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [bookingsRes, contactsRes] = await Promise.all([
          getAllBookingRequests().catch(() => ({ data: [] })),
          fetchContactsApi().catch(() => ({ data: [] }))
        ]);

        const bookings = bookingsRes.data || [];
        const contacts = contactsRes.data || [];

        // Compute Stats
        const totalBookings = bookings.length;
        const pendingInquiries = contacts.filter(c => c.status === 'Pending' || !c.status).length;
        const completedShoots = bookings.filter(b => b.status === 'Completed').length;

        setStats({ totalBookings, pendingInquiries, completedShoots });
        
        // Slicing for recent tables (top 5)
        setRecentBookings(bookings.slice(0, 5));
        setRecentInquiries(contacts.slice(0, 5));

      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <LuCheck className="inline mr-1" size={14} />;
      case 'Pending': return <LuClock className="inline mr-1" size={14} />;
      case 'Completed': return <LuCamera className="inline mr-1" size={14} />;
      case 'Cancelled': return <LuX className="inline mr-1" size={14} />;
      default: return null;
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHrs > 0) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 transition-all duration-300">
        <Header title="Dashboard Overview" toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className=" md:p-4 max-w-8xl mx-auto w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Total Bookings */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1 text-sm tracking-wide uppercase">Total Bookings</p>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? <span className="animate-pulse bg-gray-200 text-transparent rounded">000</span> : stats.totalBookings}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-yellow-600 border border-yellow-100 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                  <LuCalendar size={28} />
                </div>
              </div>
            </div>
            
            {/* Pending Inquiries */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1 text-sm tracking-wide uppercase">Pending Inquiries</p>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? <span className="animate-pulse bg-gray-200 text-transparent rounded">00</span> : stats.pendingInquiries}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <LuMessageCircle size={28} />
                </div>
              </div>
            </div>
            
            {/* Completed Shoots */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-gray-500 font-medium mb-1 text-sm tracking-wide uppercase">Completed Shoots</p>
                  <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                    {isLoading ? <span className="animate-pulse bg-gray-200 text-transparent rounded">00</span> : stats.completedShoots}
                  </h3>
                </div>
                <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-green-600 border border-green-100 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <LuCamera size={28} />
                </div>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
            
            {/* Recent Bookings Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                  <p className="text-sm text-gray-500 mt-1">Latest photography session requests</p>
                </div>
                <Link to="/admin/bookings" className="text-yellow-600 font-medium text-sm hover:text-yellow-700 flex items-center gap-1 group bg-yellow-50 px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors">
                  View All <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-100">
                      <th className="py-4 px-6 rounded-tl-lg">Client Info</th>
                      <th className="py-4 px-6">Package/Service</th>
                      <th className="py-4 px-6">Event Date</th>
                      <th className="py-4 px-6 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50 animate-pulse">
                          <td className="py-5 px-6"><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-3 bg-gray-100 rounded w-32"></div></td>
                          <td className="py-5 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="py-5 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                          <td className="py-5 px-6"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                        </tr>
                      ))
                    ) : recentBookings.length > 0 ? (
                      recentBookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-900">{booking.customerName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{booking.email}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-700">{booking.packageId?.title || 'Custom Service'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-600 font-medium">
                              {new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center w-max ${getStatusStyle(booking.status || 'Pending')}`}>
                              {getStatusIcon(booking.status || 'Pending')}
                              {booking.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <LuCalendar className="text-gray-300 mb-3" size={40} />
                            <p className="text-gray-600 font-medium">No bookings found</p>
                            <p className="text-sm mt-1 text-gray-400">Your latest booking requests will appear here.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Inquiries List */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Recent Inquiries</h3>
                  <p className="text-sm text-gray-500 mt-1">Latest messages</p>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <LuMessageCircle size={20} />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[420px] custom-scrollbar">
                {isLoading ? (
                  <div className="divide-y divide-gray-100">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="p-5 animate-pulse">
                        <div className="flex justify-between mb-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-100 rounded w-16"></div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : recentInquiries.length > 0 ? (
                  <div className="divide-y divide-gray-100/80">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry._id} className="p-5 hover:bg-gray-50/80 transition-colors group relative border-l-2 border-transparent hover:border-yellow-500">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors text-sm">{inquiry.name}</h4>
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md whitespace-nowrap ml-2">
                            {timeAgo(inquiry.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-700 mb-2 truncate">Sub: {inquiry.subject}</p>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {inquiry.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                    <LuMessageCircle className="text-gray-300 mb-3" size={40} />
                    <p className="text-gray-600 font-medium">No inquiries yet</p>
                    <p className="text-sm mt-1 text-gray-400">Customer messages will show up here.</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">
                <Link to="/admin/contact" className="text-blue-600 font-medium text-sm hover:text-blue-700 w-full py-2 flex items-center justify-center gap-1.5 transition-colors">
                  View All Messages <LuArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
