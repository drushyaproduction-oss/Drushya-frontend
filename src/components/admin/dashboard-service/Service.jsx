import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../../../utils/toastUtils';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import RightSideModal from '../../../ui/common/RightSideModal';
import ActionMenu from '../../../ui/common/ActionMenu';
import { FiPlus, FiImage, FiVideo, FiTrash2 } from 'react-icons/fi';
import { getAllCategories } from '../../../api/category';
import { getAllServices, createService, updateService, deleteService } from '../../../api/service';
import { getImageUrl } from '../../../config';

const Service = ({ isTrendingPage = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    status: 'Active',
    bannerVideo: '',
    isTrending: false
  });

  // Separate states for file objects and previews
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  // Banners
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [existingBanners, setExistingBanners] = useState([]);

  // Gallery
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, srvsRes] = await Promise.all([
        getAllCategories(),
        getAllServices()
      ]);
      
      if (catsRes && catsRes.success) setCategories(catsRes.data);
      if (srvsRes && srvsRes.success) setServices(srvsRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (mode, service = null) => {
    setModalMode(mode);
    setSelectedService(service);
    setActiveTab('basic');

    // Reset file states
    setThumbnailFile(null);
    setThumbnailPreview('');
    setBannerFiles([]);
    setBannerPreviews([]);
    setExistingBanners([]);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);

    if (service && (mode === 'edit' || mode === 'view')) {
      setFormData({ 
        name: service.name || '', 
        categoryId: service.categoryId || '', 
        description: service.description || '', 
        status: service.status || 'Active', 
        bannerVideo: service.bannerVideo || '', 
        isTrending: service.isTrending || false
      });
      setThumbnailPreview(getImageUrl(service.thumbnail));
      
      const mappedBanners = (service.banners || []).map(b => getImageUrl(b));
      setExistingBanners(mappedBanners);
      setBannerPreviews(mappedBanners);

      const mappedGallery = (service.gallery || []).map(g => getImageUrl(g));
      setExistingGallery(mappedGallery);
      setGalleryPreviews(mappedGallery);
      
    } else {
      setFormData({ 
        name: '', 
        categoryId: '', 
        description: '', 
        status: 'Active', 
        bannerVideo: '', 
        isTrending: false 
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedService(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = type === 'checkbox' ? checked : value;
    
    // Auto-convert youtube watch URLs to embed URLs
    if (name === 'bannerVideo' && processedValue) {
      if (processedValue.includes('youtube.com/watch?v=')) {
        processedValue = processedValue.replace('youtube.com/watch?v=', 'youtube.com/embed/');
        // Remove any additional query parameters like &t=
        processedValue = processedValue.split('&')[0];
      } else if (processedValue.includes('youtu.be/')) {
        processedValue = processedValue.replace('youtu.be/', 'youtube.com/embed/');
        processedValue = processedValue.split('?')[0];
      }
    }

    setFormData(prev => ({ 
      ...prev, 
      [name]: processedValue 
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleBannersAdd = (e) => {
    const files = Array.from(e.target.files);
    setBannerFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setBannerPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeBannerImage = (index) => {
    const totalExisting = existingBanners.length;
    if (index < totalExisting) {
      // Removing an existing banner
      const updatedExisting = [...existingBanners];
      updatedExisting.splice(index, 1);
      setExistingBanners(updatedExisting);
      
      const updatedPreviews = [...bannerPreviews];
      updatedPreviews.splice(index, 1);
      setBannerPreviews(updatedPreviews);
    } else {
      // Removing a newly added banner file
      const newFileIndex = index - totalExisting;
      const updatedFiles = [...bannerFiles];
      updatedFiles.splice(newFileIndex, 1);
      setBannerFiles(updatedFiles);

      const updatedPreviews = [...bannerPreviews];
      updatedPreviews.splice(index, 1);
      setBannerPreviews(updatedPreviews);
    }
  };

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    const totalExisting = existingGallery.length;
    if (index < totalExisting) {
      const updatedExisting = [...existingGallery];
      updatedExisting.splice(index, 1);
      setExistingGallery(updatedExisting);
      
      const updatedPreviews = [...galleryPreviews];
      updatedPreviews.splice(index, 1);
      setGalleryPreviews(updatedPreviews);
    } else {
      const newFileIndex = index - totalExisting;
      const updatedFiles = [...galleryFiles];
      updatedFiles.splice(newFileIndex, 1);
      setGalleryFiles(updatedFiles);

      const updatedPreviews = [...galleryPreviews];
      updatedPreviews.splice(index, 1);
      setGalleryPreviews(updatedPreviews);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.name || !formData.categoryId) {
      toast.error("Name and Category are required");
      return;
    }
    if (modalMode === 'add' && !thumbnailFile) {
      toast.error("Thumbnail is required");
      return;
    }

    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('description', formData.description || '');
      submitData.append('status', formData.status);
      submitData.append('bannerVideo', formData.bannerVideo || '');
      submitData.append('isTrending', formData.isTrending);

      if (thumbnailFile) submitData.append('thumbnail', thumbnailFile);
      
      bannerFiles.forEach(file => submitData.append('banners', file));
      galleryFiles.forEach(file => submitData.append('gallery', file));

      if (modalMode === 'edit') {
        // Find raw urls (not absolute mapped ones) to send back
        const rawExistingBanners = existingBanners.map(mapped => {
            const original = (selectedService.banners || []).find(b => getImageUrl(b) === mapped);
            return original || mapped;
        });
        const rawExistingGallery = existingGallery.map(mapped => {
            const original = (selectedService.gallery || []).find(g => getImageUrl(g) === mapped);
            return original || mapped;
        });

        rawExistingBanners.forEach(url => submitData.append('existingBanners', url));
        rawExistingGallery.forEach(url => submitData.append('existingGallery', url));
        
        const data = await updateService(selectedService._id, submitData);
        if (data && data.success) {
          setServices(services.map(srv => srv._id === selectedService._id ? data.data : srv));
          toast.success("Service updated successfully!");
          closeModal();
        }
      } else {
        const data = await createService(formData.categoryId, submitData);
        if (data && data.success) {
          setServices([data.data, ...services]);
          toast.success("Service added successfully!");
          closeModal();
        }
      }
    } catch (error) {
      console.error("Failed to save service", error);
      toast.error(error.message || "Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteService(id);
        setServices(services.filter(srv => srv._id !== id));
        toast.success("Service deleted successfully!");
      } catch (error) {
        console.error("Failed to delete service", error);
        toast.error("Failed to delete service");
      }
    }, 'Are you sure you want to delete this service and all its related packages/gallery images?');
  };

  const toggleTrending = async (service) => {
    try {
      const submitData = new FormData();
      submitData.append('isTrending', !service.isTrending);
      
      // Preserve existing arrays to prevent them being wiped since we're using update route
      (service.banners || []).forEach(url => submitData.append('existingBanners', url));
      (service.gallery || []).forEach(url => submitData.append('existingGallery', url));

      const data = await updateService(service._id, submitData);
      if (data && data.success) {
        setServices(services.map(s => s._id === service._id ? data.data : s));
        toast.success(data.data.isTrending ? "Service marked as trending!" : "Service removed from trending!");
      }
    } catch (error) {
       console.error("Failed to toggle trending", error);
    }
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c._id === catId);
    return cat ? cat.name : 'Unknown';
  };

  const filteredServices = services.filter(srv => 
    (!isTrendingPage || srv.isTrending) && 
    (selectedCategoryId === 'All' || srv.categoryId === selectedCategoryId)
  );

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
        <Header title={isTrendingPage ? "Trending Services" : "Service Management"} toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">{isTrendingPage ? "Trending Services" : "Services"}</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <select 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white shadow-sm text-gray-700 font-medium cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {!isTrendingPage && (
                <button 
                  onClick={() => openModal('add')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <FiPlus size={20} /> Add Service
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((srv) => (
                  <div key={srv._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col relative z-0">
                    <div className="h-48 bg-gray-200 relative rounded-t-xl overflow-hidden group">
                      {srv.thumbnail ? (
                        <img src={getImageUrl(srv.thumbnail)} alt={srv.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiImage size={40} />
                        </div>
                      )}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${srv.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {srv.status}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 pr-8">{srv.name}</h3>
                        <div className="absolute right-3 top-4">
                          <ActionMenu 
                            onView={() => openModal('view', srv)}
                            onEdit={() => openModal('edit', srv)}
                            onDelete={() => handleDelete(srv._id)}
                            onTrending={() => toggleTrending(srv)}
                            isTrending={srv.isTrending}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md inline-block mb-3 w-fit">
                        {getCategoryName(srv.categoryId)}
                      </span>
                      <p className="text-sm text-gray-500 line-clamp-2 flex-1">{srv.description || <span className="italic">No description</span>}</p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mt-6">
                  <p className="text-gray-500">{isTrendingPage ? 'No trending services found.' : 'No services found. Click "Add Service" to create one.'}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Side Modal for Add/Edit/View */}
      <RightSideModal 
        visible={modalVisible} 
        onHide={closeModal} 
        title={
          modalMode === 'add' ? 'Add New Service' : 
          modalMode === 'edit' ? 'Edit Service' : 'Service Details'
        }
      >
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-2 mb-5 overflow-x-auto no-scrollbar">
            <button 
              type="button"
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'basic' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button 
              type="button"
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'banners' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('banners')}
            >
              Banners
            </button>
            <button 
              type="button"
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gallery' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
            <button 
              type="button"
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'video' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('video')}
            >
              Video
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-6 pr-2">
            
            {/* --- BASIC INFO TAB --- */}
            {activeTab === 'basic' && (
              <div className="flex flex-col gap-4">
                {modalMode === 'view' ? (
                  <div className="space-y-4">
                    <div className="h-48 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      {thumbnailPreview ? (
                        <img src={thumbnailPreview} alt={formData.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiImage size={40} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Service Name</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Category</p>
                      <p className="text-md text-gray-800 mt-1">{getCategoryName(formData.categoryId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Description</p>
                      <p className="text-md text-gray-800 mt-1">{formData.description || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Status & Trending</p>
                      <div className="flex gap-2 items-center mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${formData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {formData.status}
                        </span>
                        {formData.isTrending && (
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                            Trending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Service Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Premium Wedding Package" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <div className="relative">
                        <select 
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none ${formData.categoryId ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3} 
                        placeholder="Enter service description..." 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Thumbnail Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer text-gray-900"
                      />
                      {thumbnailPreview && (
                        <div className="mt-2 h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
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

                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="checkbox" 
                        name="isTrending"
                        id="isTrending"
                        checked={formData.isTrending}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="isTrending" className="text-sm font-medium text-gray-700 cursor-pointer">Mark as Trending Service</label>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* --- BANNERS TAB --- */}
            {activeTab === 'banners' && (
              <div className="flex flex-col gap-4">
                {modalMode !== 'view' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Upload Service Banner Images (Multiple)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleBannersAdd}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer text-gray-900"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 mt-2">
                  {bannerPreviews && bannerPreviews.length > 0 ? (
                    bannerPreviews.map((img, idx) => (
                      <div key={idx} className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                        <img src={img} alt={`Banner ${idx}`} className="w-full h-full object-cover" />
                        {modalMode !== 'view' && (
                          <button 
                            onClick={() => removeBannerImage(idx)}
                            className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-6">No banner images uploaded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- GALLERY TAB --- */}
            {activeTab === 'gallery' && (
              <div className="flex flex-col gap-4">
                {modalMode !== 'view' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Upload Gallery Images (Multiple)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleGalleryAdd}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer text-gray-900"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {galleryPreviews && galleryPreviews.length > 0 ? (
                    galleryPreviews.map((img, idx) => (
                      <div key={idx} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden group">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        {modalMode !== 'view' && (
                          <button 
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute top-1 right-1 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-gray-500 text-center py-6">No gallery images uploaded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* --- VIDEO TAB --- */}
            {activeTab === 'video' && (
              <div className="flex flex-col gap-4">
                {modalMode !== 'view' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Video URL (YouTube/Vimeo)</label>
                    <input 
                      type="text" 
                      name="bannerVideo"
                      value={formData.bannerVideo}
                      onChange={handleInputChange}
                      placeholder="e.g. https://www.youtube.com/embed/..." 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500">Provide an embed URL (e.g. youtube.com/embed/xyz)</p>
                  </div>
                )}

                {formData.bannerVideo ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 font-medium mb-2">Video Preview</p>
                    <div className="h-48 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <iframe 
                        src={formData.bannerVideo} 
                        className="w-full h-full" 
                        title="Service Video"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-6">No video URL provided.</p>
                )}
              </div>
            )}
            
          </div>

          {/* Footer Actions */}
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
                {isSaving ? 'Saving...' : modalMode === 'add' ? 'Save Service' : 'Update Service'}
              </button>
            </div>
          )}
          {modalMode === 'view' && (
            <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
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

export default Service;
