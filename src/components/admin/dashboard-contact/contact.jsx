import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../../../utils/toastUtils';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import RightSideModal from '../../../ui/common/RightSideModal';
import ActionMenu from '../../../ui/common/ActionMenu';
import { FiMail, FiCalendar, FiUser, FiPhone } from 'react-icons/fi';
import { fetchContactsApi, updateContactStatusApi, deleteContactApi, sendContactEmailApi } from '../../../api/contact';

const Contact = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await fetchContactsApi();
      setContacts(data.data || []);
    } catch (error) {
      console.error("Failed to load contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'edit', 'view'
  const [selectedContact, setSelectedContact] = useState(null);
  
  const [formData, setFormData] = useState({
    status: 'Pending',
    notes: ''
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteContactApi(id);
        setContacts(contacts.filter(c => c._id !== id));
        toast.success("Message deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete contact message");
        console.error(error);
      }
    }, 'Are you sure you want to delete this contact message?');
  };

  const openModal = (mode, contact) => {
    setModalMode(mode);
    setSelectedContact(contact);
    setFormData({ status: contact.status, notes: contact.notes || '' });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedContact(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (modalMode === 'edit' && selectedContact) {
      setIsSaving(true);
      try {
        await updateContactStatusApi(selectedContact._id, { status: formData.status, notes: formData.notes });
        setContacts(contacts.map(c => 
          c._id === selectedContact._id ? { ...c, status: formData.status, notes: formData.notes } : c
        ));
        toast.success("Message updated successfully!");
        closeModal();
      } catch (error) {
        toast.error("Failed to update contact message");
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    } else {
      closeModal();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactStatusApi(id, { status: newStatus });
      setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleSendEmail = async (id) => {
    try {
      const res = await sendContactEmailApi(id);
      if (res && res.success) {
        toast.success('Contact reply email sent successfully!');
      }
    } catch (error) {
      console.error('Failed to send email', error);
      toast.error(error.message || 'Failed to send email');
    }
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(contact => {
    if (statusFilter !== 'All' && contact.status !== statusFilter) return false;
    return true;
  });

  const tabs = ['All', 'Pending', 'In Progress', 'Resolved'];

  const getServiceName = (serviceKey) => {
    const services = {
      'portraits': 'Portraits',
      'weddings': 'Weddings',
      'corporate': 'Corporate',
      'commercial': 'Commercial'
    };
    return services[serviceKey] || serviceKey;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 transition-all duration-300">
        <Header title="Contact Submissions" toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 mb-6 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = statusFilter === tab;
              const count = tab === 'All' ? contacts.length : contacts.filter(c => c.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'border-yellow-500 text-yellow-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500">
                    <th className="py-4 px-6 font-medium">Sender</th>
                    <th className="py-4 px-6 font-medium">Service of Interest</th>
                    <th className="py-4 px-6 font-medium">Studio</th>
                    <th className="py-4 px-6 font-medium">Message Snapshot</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredContacts.map((contact, index) => {
                    const isLastRows = index >= filteredContacts.length - 2 && filteredContacts.length > 2;
                    return (
                    <tr key={contact.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                            <FiUser size={14} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{contact.name}</div>
                            <div className="text-xs text-gray-500">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                          {getServiceName(contact.subject)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {contact.studioLocation ? (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs whitespace-nowrap">
                            {contact.studioLocation}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-500 max-w-[200px] truncate">
                        {contact.message}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiCalendar size={14} className="text-gray-400" />
                          <span className="whitespace-nowrap">{new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative inline-block w-36">
                          <select 
                            value={contact.status}
                            onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                            className={`w-full text-xs font-bold pl-3 pr-8 py-1.5 rounded-full border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 ${getStatusColor(contact.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="w-3 h-3 fill-current opacity-70" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <ActionMenu 
                          onView={() => openModal('view', contact)}
                          onEdit={() => openModal('edit', contact)}
                          onDelete={() => handleDelete(contact._id)}
                          onSendEmail={() => handleSendEmail(contact._id)}
                          position={isLastRows ? 'top' : 'bottom'}
                        />
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
            
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No messages found matching the filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Side Modal for View/Edit */}
      <RightSideModal 
        visible={modalVisible} 
        onHide={closeModal} 
        title={modalMode === 'edit' ? 'Edit Submission' : 'Message Details'}
      >
        <div className="flex flex-col h-full mt-4">
          {selectedContact && (
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="text-sm text-gray-500 mb-1">Sender Details</div>
                <div className="font-bold text-gray-900 text-lg mb-2">{selectedContact.name}</div>
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><FiMail className="text-gray-400"/> {selectedContact.email}</div>
                  {selectedContact.mobile && <div className="flex items-center gap-2"><FiPhone className="text-gray-400"/> {selectedContact.mobile}</div>}
                </div>
              </div>

              <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl mb-6">
                <div className="text-sm text-yellow-800 font-semibold mb-2 flex justify-between">
                  <span>Inquiry Details</span>
                  <span className="text-gray-500 font-normal">{new Date(selectedContact.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-3 text-sm text-gray-700">
                  <div>
                    <strong className="block mb-1 text-gray-900">Service of Interest:</strong> 
                    <span className="bg-white px-2 py-1 rounded border border-gray-200 inline-block mr-2">{getServiceName(selectedContact.subject)}</span>
                  </div>
                  <div>
                    <strong className="block mb-1 text-gray-900">Studio Location:</strong> 
                    {selectedContact.studioLocation ? (
                      <span className="bg-white px-2 py-1 rounded border border-gray-200 inline-block">{selectedContact.studioLocation}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <strong className="block mb-1 text-gray-900">Message:</strong>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap text-gray-600 leading-relaxed">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                {modalMode === 'edit' ? (
                  <div className="relative">
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none text-sm text-gray-900`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                ) : (
                  <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(formData.status)}`}>
                    {formData.status}
                  </span>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                {modalMode === 'edit' ? (
                  <textarea 
                    value={formData.notes} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Add private notes or track follow-ups..."
                  />
                ) : (
                  <p className="text-sm text-gray-700 bg-white border border-gray-200 p-4 rounded-lg min-h-[60px]">
                    {formData.notes ? formData.notes : <span className="text-gray-400 italic">No notes added yet.</span>}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          {modalMode === 'edit' && (
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer ${isSaving ? 'bg-yellow-400 text-white cursor-not-allowed opacity-70' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
          {modalMode === 'view' && (
            <div className="mt-auto pt-4 border-t border-gray-100">
              <button 
                onClick={closeModal}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </RightSideModal>
    </div>
  );
};

export default Contact;
