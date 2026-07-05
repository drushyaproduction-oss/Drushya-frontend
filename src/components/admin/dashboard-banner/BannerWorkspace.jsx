import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../../../utils/toastUtils';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import RightSideModal from '../../../ui/common/RightSideModal';
import ActionMenu from '../../../ui/common/ActionMenu';
import { FiPlus, FiImage } from 'react-icons/fi';
import { fetchBannersApi, createBannerApi, updateBannerApi, deleteBannerApi } from '../../../api/banner';
import { getImageUrl } from '../../../config';

const BannerWorkspace = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchBannersApi('Workspace');
      if (data && data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch banners", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    thumbnail: '',
    alt: '',
    title: '',
    subtitle: '',
    status: 'Active'
  });

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteBannerApi(id);
        setBanners(banners.filter(b => b._id !== id));
        toast.success("Banner deleted successfully!");
      } catch (error) {
        console.error("Failed to delete banner", error);
        toast.error("Failed to delete banner");
      }
    }, 'Are you sure you want to delete this banner?');
  };

  const openModal = (mode, banner = null) => {
    setModalMode(mode);
    setSelectedBanner(banner);
    setImageFile(null);
    
    if (banner && (mode === 'edit' || mode === 'view')) {
      setFormData({ 
        ...banner,
        thumbnail: banner.imageUrl || banner.thumbnail || ''
      });
    } else {
      setFormData({
        thumbnail: '',
        alt: '',
        title: '',
        subtitle: '',
        status: 'Active'
      });
    }
    
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBanner(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
      setImageFile(file);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('type', 'Workspace');
      submitData.append('title', formData.title || '');
      submitData.append('subtitle', formData.subtitle || '');
      submitData.append('alt', formData.alt || '');
      submitData.append('status', formData.status);
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (modalMode === 'add') {
        toast.error("Please select an image first.");
        setIsSaving(false);
        return;
      }

      if (modalMode === 'add') {
        const { data } = await createBannerApi(submitData);
        if (data && data.success) {
          setBanners([data.data, ...banners]);
          toast.success("Banner created successfully!");
          closeModal();
        }
      } else if (modalMode === 'edit' && selectedBanner) {
        const { data } = await updateBannerApi(selectedBanner._id, submitData);
        if (data && data.success) {
          setBanners(banners.map(b => b._id === selectedBanner._id ? data.data : b));
          toast.success("Banner updated successfully!");
          closeModal();
        }
      }
    } catch (error) {
      console.error("Failed to save banner", error);
      toast.error(error.response?.data?.message || "Failed to save banner. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0 transition-all duration-300">
        <Header title="Workspace Banner Management" toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Workspace Banners</h2>
            <button 
              onClick={() => openModal('add')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiPlus size={20} /> Add Banner
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="relative h-48 sm:h-64 bg-gray-200">
                    {banner.imageUrl || banner.thumbnail ? (
                      <img 
                        src={getImageUrl(banner.imageUrl || banner.thumbnail)} 
                        alt={banner.alt} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiImage size={40} />
                      </div>
                    )}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${banner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {banner.status}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 rounded-full shadow-sm">
                      <ActionMenu 
                        onView={() => openModal('view', banner)}
                        onEdit={() => openModal('edit', banner)}
                        onDelete={() => handleDelete(banner._id)}
                      />
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{banner.title || <span className="text-gray-400 italic">No Title</span>}</h3>
                    <p className="text-sm text-gray-500 mb-3 flex-1">{banner.subtitle || <span className="text-gray-400 italic">No Subtitle</span>}</p>
                    <p className="text-xs text-gray-400">Alt text: {banner.alt || 'None'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && banners.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mt-6">
              <p className="text-gray-500">No banners found. Click "Add Banner" to create one.</p>
            </div>
          )}
        </div>
      </div>
      
      <RightSideModal 
        visible={modalVisible} 
        onHide={closeModal} 
        title={
          modalMode === 'add' ? 'Add New Banner' : 
          modalMode === 'edit' ? 'Edit Banner' : 'Banner Details'
        }
      >
        <div className="flex flex-col h-full mt-4">
          <div className="flex-1 overflow-y-auto pr-2 space-y-5 pb-6">
            
            {modalMode === 'view' ? (
              <div className="space-y-5">
                <div className="h-48 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  {formData.thumbnail ? (
                    <img src={getImageUrl(formData.thumbnail)} alt={formData.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiImage size={40} />
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Title</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{formData.title || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Subtitle</p>
                      <p className="text-md text-gray-800 mt-1">{formData.subtitle || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Alt Text</p>
                      <p className="text-md text-gray-800 mt-1">{formData.alt || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Status</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${formData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {formData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Thumbnail Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer text-gray-900"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={getImageUrl(formData.thumbnail)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Our Workspace" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Subtitle</label>
                  <textarea 
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g. A creative environment designed to inspire..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Image Alt Text (SEO)</label>
                  <input 
                    type="text" 
                    name="alt"
                    value={formData.alt}
                    onChange={handleInputChange}
                    placeholder="e.g. Workspace Banner 1" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="relative">
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none ${formData.status ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
            
          </div>

          {modalMode !== 'view' && (
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
                className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors cursor-pointer ${isSaving ? 'bg-yellow-400 opacity-70 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
              >
                {isSaving ? 'Saving...' : modalMode === 'add' ? 'Save Banner' : 'Update Banner'}
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

export default BannerWorkspace;
