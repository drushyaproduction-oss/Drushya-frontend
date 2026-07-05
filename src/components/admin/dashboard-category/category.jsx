import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../../../utils/toastUtils';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import RightSideModal from '../../../ui/common/RightSideModal';
import ActionMenu from '../../../ui/common/ActionMenu';
import { FiPlus, FiImage } from 'react-icons/fi';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../../api/category';
import { getImageUrl } from '../../../config';

const Category = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'add', 'edit', 'view'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories();
      if (data && data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    setImageFile(null);
    
    if (category && (mode === 'edit' || mode === 'view')) {
      setFormData({ 
        name: category.name || '',
        description: category.description || '',
        image: category.thumbnail || ''
      });
    } else {
      setFormData({ name: '', description: '', image: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setImageFile(file);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.name) {
      toast.error("Category name is required");
      return;
    }

    setIsSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description || '');
      
      if (imageFile) {
        submitData.append('thumbnail', imageFile);
      } else if (modalMode === 'add') {
        toast.error("Please select a category image first.");
        setIsSaving(false);
        return;
      }

      if (modalMode === 'add') {
        const data = await createCategory(submitData);
        if (data && data.success) {
          setCategories([data.data, ...categories]);
          toast.success("Category created successfully!");
          closeModal();
        }
      } else if (modalMode === 'edit' && selectedCategory) {
        const data = await updateCategory(selectedCategory._id, submitData);
        if (data && data.success) {
          setCategories(categories.map(cat => cat._id === selectedCategory._id ? data.data : cat));
          toast.success("Category updated successfully!");
          closeModal();
        }
      }
    } catch (error) {
      console.error("Failed to save category", error);
      toast.error(error.message || "Failed to save category. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(cat => cat._id !== id));
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Failed to delete category", error);
        toast.error(error.message || "Failed to delete category");
      }
    }, 'Are you sure you want to delete this category? This will also delete all related subcategories, packages, bookings, reviews, and gallery images!');
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
        <Header title="Category Management" toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
            <button 
              onClick={() => openModal('add')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiPlus size={20} /> Add Category
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col relative z-0">
                  <div className="h-48 bg-gray-200 relative rounded-t-xl overflow-hidden group">
                    {cat.thumbnail ? (
                      <img src={getImageUrl(cat.thumbnail)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiImage size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 pr-8">{cat.name}</h3>
                      <div className="absolute right-3 top-4">
                        <ActionMenu 
                          onView={() => openModal('view', cat)}
                          onEdit={() => openModal('edit', cat)}
                          onDelete={() => handleDelete(cat._id)}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 flex-1">{cat.description || <span className="italic">No description</span>}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && categories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mt-6">
              <p className="text-gray-500">No categories found. Click "Add Category" to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Modal for Add/Edit/View */}
      <RightSideModal 
        visible={modalVisible} 
        onHide={closeModal} 
        title={
          modalMode === 'add' ? 'Add New Category' : 
          modalMode === 'edit' ? 'Edit Category' : 'Category Details'
        }
      >
        <div className="flex flex-col h-full mt-4">
          <div className="flex-1 overflow-y-auto pr-2 pb-6 gap-5 flex flex-col">
            {modalMode === 'view' ? (
              <div className="space-y-6">
                <div className="h-48 w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  {formData.image ? (
                    <img src={getImageUrl(formData.image)} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiImage size={40} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Category Name</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Description</p>
                  <p className="text-md text-gray-800 mt-1">{formData.description || '-'}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Category Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Wedding Photography" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4} 
                    placeholder="Enter category description..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Category Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer text-gray-900"
                  />
                  {formData.image && (
                    <div className="mt-2 h-32 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </>
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
                {isSaving ? 'Saving...' : modalMode === 'add' ? 'Add Category' : 'Save Changes'}
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

export default Category;
