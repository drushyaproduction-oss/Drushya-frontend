import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { confirmDelete } from '../../../utils/toastUtils';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import RightSideModal from '../../../ui/common/RightSideModal';
import ActionMenu from '../../../ui/common/ActionMenu';
import { FiStar, FiUser } from 'react-icons/fi';
import { getAllReviews, updateReview, deleteReview } from '../../../api/review';
import { getAllCategories } from '../../../api/category';
import { getAllPackages } from '../../../api/package';

const Reviews = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'edit', 'view'
  const [selectedReview, setSelectedReview] = useState(null);
  
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reviewsRes, categoriesRes, packagesRes] = await Promise.all([
        getAllReviews(),
        getAllCategories(),
        getAllPackages()
      ]);
      
      if (reviewsRes && reviewsRes.success) setReviews(reviewsRes.data);
      if (categoriesRes && categoriesRes.success) setCategories(categoriesRes.data);
      if (packagesRes && packagesRes.success) setPackages(packagesRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteReview(id);
        setReviews(reviews.filter(r => r._id !== id));
        toast.success("Review deleted successfully!");
      } catch (err) {
        console.error('Failed to delete review', err);
        toast.error('Failed to delete review');
      }
    }, 'Are you sure you want to delete this review?');
  };

  const openModal = (mode, review) => {
    setModalMode(mode);
    setSelectedReview(review);
    setFormData({ rating: review.rating, comment: review.review });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const handleSave = async () => {
    if (modalMode === 'edit' && selectedReview) {
      try {
        const updateData = { rating: Number(formData.rating), review: formData.comment };
        const res = await updateReview(selectedReview._id, updateData);
        if (res && res.success) {
          setReviews(reviews.map(r => r._id === selectedReview._id ? { ...r, ...updateData } : r));
          toast.success("Review updated successfully!");
        }
      } catch (err) {
        console.error('Failed to update review', err);
        toast.error('Failed to update review');
      }
    }
    closeModal();
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(review => {
    if (selectedCategory && review.categoryId?._id !== selectedCategory) return false;
    if (selectedPackage && review.packageId?._id !== selectedPackage) return false;
    return true;
  });

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
        <Header title="Reviews Management" toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">All Reviews</h2>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <div className="relative min-w-[160px]">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedPackage(''); // Reset package when category changes
                  }}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none text-sm ${selectedCategory ? 'text-gray-900' : 'text-gray-600'}`}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
              
              <div className="relative min-w-[160px]">
                <select 
                  value={selectedPackage} 
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer bg-white appearance-none text-sm ${selectedPackage ? 'text-gray-900' : 'text-gray-600'} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  disabled={!selectedCategory}
                >
                  <option value="">All Packages</option>
                  {packages
                    .filter(s => !selectedCategory || s.category?._id === selectedCategory || s.category === selectedCategory)
                    .map(s => (
                      <option key={s._id} value={s._id}>{s.title}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
                Loading reviews...
              </div>
            ) : filteredReviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative hover:shadow-md transition-shadow">
                <div className="absolute right-4 top-4">
                  <ActionMenu 
                    onView={() => openModal('view', review)}
                    onEdit={() => openModal('edit', review)}
                    onDelete={() => handleDelete(review._id)}
                  />
                </div>

                <div className="flex items-center gap-3 mb-4 pr-6">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight truncate">{review.customerName}</h4>
                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                    />
                  ))}
                </div>

                <div className="mb-3">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md mb-2">
                    {review.packageId?.title || 'Unknown Package'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm italic flex-1 line-clamp-3">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mt-6">
              <p className="text-gray-500">No reviews found matching the filters.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Side Modal for View/Edit */}
      <RightSideModal 
        visible={modalVisible} 
        onHide={closeModal} 
        title={modalMode === 'edit' ? 'Edit Review' : 'View Review'}
      >
        <div className="flex flex-col h-full mt-4">
          {selectedReview && (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="text-sm text-gray-500 mb-1">Reviewer Info</div>
                <div className="font-bold text-gray-900">{selectedReview.customerName}</div>
                <div className="text-xs text-gray-400 mt-1">Submitted on {new Date(selectedReview.createdAt).toLocaleDateString()}</div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-500">Package: </span>
                  <span className="font-semibold text-gray-800">{selectedReview.packageId?.title || 'Unknown Package'}</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                {modalMode === 'edit' ? (
                  <div className="relative">
                    <select 
                      value={formData.rating} 
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer appearance-none text-gray-900"
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} Stars</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        size={18} 
                        className={i < formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                {modalMode === 'edit' ? (
                  <textarea 
                    value={formData.comment} 
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Enter review comment..."
                  />
                ) : (
                  <p className="text-sm text-gray-700 bg-white border border-gray-200 p-4 rounded-lg italic">
                    "{formData.comment}"
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
                className="flex-1 px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
              >
                Update Review
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

export default Reviews;
