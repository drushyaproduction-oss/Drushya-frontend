import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../../../utils/toastUtils';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import RightSideModal from '../../../ui/common/RightSideModal';
import ActionMenu from '../../../ui/common/ActionMenu';
import { FiPlus, FiImage, FiTrash2 } from 'react-icons/fi';

import BasicInfoTab from './tabs/BasicInfoTab';

import { getAllCategories } from '../../../api/category';
import { getAllServices } from '../../../api/service';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../../../api/package';
import { getImageUrl } from '../../../config';

const Package = ({ isTrendingPage = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState('All');

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, srvsRes, pkgsRes] = await Promise.all([
        getAllCategories(),
        getAllServices(),
        getAllPackages()
      ]);
      
      if (catsRes && catsRes.success) setCategories(catsRes.data);
      if (srvsRes && srvsRes.success) setServices(srvsRes.data);
      if (pkgsRes && pkgsRes.success) setPackages(pkgsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'add', 'edit', 'view'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    serviceId: '',
    price: '',
    description: '',
    thumbnail: '',
    features: [],
    benefits: [],
    requirements: [],
    itinerary: [],
    status: 'Active',
    reviews: [],
    bookings: [],
    banners: [],
    gallery: [],
    bannerVideo: ''
  });

  const openModal = (mode, pkg = null) => {
    setModalMode(mode);
    setSelectedPackage(pkg);

    if (pkg && (mode === 'edit' || mode === 'view')) {
      setFormData({ 
        ...pkg,
        categoryId: typeof pkg.categoryId === 'object' ? pkg.categoryId._id : (pkg.categoryId || ''),
        serviceId: typeof pkg.subCategoryId === 'object' ? pkg.subCategoryId._id : (typeof pkg.serviceId === 'object' ? pkg.serviceId._id : (pkg.subCategoryId || pkg.serviceId || ''))
      });
    } else {
      setFormData({
        title: '',
        categoryId: '',
        serviceId: '',
        price: '',
        description: '',
        thumbnail: '',
        features: [],
        benefits: [],
        requirements: [],
        itinerary: [],
        status: 'Active',
        isTrending: false
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPackage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'categoryId') {
        updated.serviceId = '';
      }
      return updated;
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnail: imageUrl, thumbnailFile: file }));
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.title || !formData.categoryId || !formData.serviceId || !formData.price || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('subCategoryId', formData.serviceId);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('isTrending', formData.isTrending);

      if (formData.features && formData.features.length) formDataToSend.append('features', JSON.stringify(formData.features));
      if (formData.benefits && formData.benefits.length) formDataToSend.append('benefits', JSON.stringify(formData.benefits));
      if (formData.requirements && formData.requirements.length) formDataToSend.append('requirements', JSON.stringify(formData.requirements));
      if (formData.itinerary && formData.itinerary.length) formDataToSend.append('itinerary', JSON.stringify(formData.itinerary));

      // Append file if newly selected (it's a File object, not a string URL)
      if (formData.thumbnailFile) {
        formDataToSend.append('coverImage', formData.thumbnailFile);
      }

      if (modalMode === 'add') {
        await createPackage(formDataToSend);
      } else if (modalMode === 'edit') {
        await updatePackage(selectedPackage._id, formDataToSend);
      }
      
      
      closeModal();
      toast.success(modalMode === 'add' ? "Package created successfully!" : "Package updated successfully!");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to save package:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to save package";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deletePackage(id);
        toast.success("Package deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete package:", error);
        toast.error("Failed to delete package");
      }
    }, 'Are you sure you want to delete this package?');
  };

  const getCategoryName = (catId) => {
    if (!catId) return 'Unknown';
    if (typeof catId === 'object' && catId.name) return catId.name;
    const cat = categories.find(c => c._id === (catId._id || catId));
    return cat ? cat.name : 'Unknown';
  };

  const getServiceName = (srvId) => {
    if (!srvId) return 'Unknown';
    if (typeof srvId === 'object' && srvId.name) return srvId.name;
    const srv = services.find(s => s._id === (srvId._id || srvId));
    return srv ? srv.name : 'Unknown';
  };

  const toggleTrending = async (pkg) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('isTrending', !pkg.isTrending);
      await updatePackage(pkg._id, formDataToSend);
      toast.success(pkg.isTrending ? "Package removed from trending!" : "Package marked as trending!");
      fetchData();
    } catch (error) {
      console.error("Failed to update trending status:", error);
    }
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
        <Header title={isTrendingPage ? "Trending Packages" : "Package Management"} toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">{isTrendingPage ? "Trending Packages" : "Packages"}</h2>
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
                  <FiPlus size={20} /> Add Package
                </button>
              )}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.filter(pkg => 
              (!isTrendingPage || pkg.isTrending) && 
              (selectedCategoryId === 'All' || pkg.categoryId === selectedCategoryId)
            ).map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col relative z-0">
                <div className="h-48 bg-gray-200 relative rounded-t-xl overflow-hidden group">
                  {pkg.coverImage || pkg.thumbnail ? (
                    <img src={getImageUrl(pkg.coverImage || pkg.thumbnail)} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiImage size={40} />
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${pkg.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {pkg.status}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-sm font-bold shadow-sm bg-gray-900 text-white">
                    ₹{pkg.price}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 pr-8">{pkg.title}</h3>
                    <div className="absolute right-3 top-4">
                      <ActionMenu 
                        onView={() => openModal('view', pkg)}
                        onEdit={() => openModal('edit', pkg)}
                        onDelete={() => handleDelete(pkg._id)}
                        onTrending={() => toggleTrending(pkg)}
                        isTrending={pkg.isTrending}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                      {getCategoryName(pkg.categoryId)}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {getServiceName(pkg.subCategoryId || pkg.serviceId)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{pkg.description}</p>
                </div>
              </div>
            ))}
          </div>

          {packages.filter(pkg => !isTrendingPage || pkg.isTrending).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">{isTrendingPage ? 'No trending packages found.' : 'No packages found. Click "Add Package" to create one.'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Modal for Add/Edit/View */}
      <RightSideModal 
        visible={modalVisible} 
        onHide={closeModal} 
        title={
          modalMode === 'add' ? 'Add New Package' : 
          modalMode === 'edit' ? 'Edit Package' : 'Package Details'
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto pb-6 mt-4">
            <BasicInfoTab 
              modalMode={modalMode} 
              formData={formData} 
              setFormData={setFormData}
              categories={categories}
              services={services}
              handleInputChange={handleInputChange}
              handleThumbnailChange={handleThumbnailChange}
            />
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
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer ${isSaving ? 'bg-yellow-400 text-white cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
              >
                {isSaving ? 'Saving...' : modalMode === 'add' ? 'Save Package' : 'Update Package'}
              </button>
            </div>
          )}
        </div>
      </RightSideModal>
    </div>
  );
};

export default Package;
