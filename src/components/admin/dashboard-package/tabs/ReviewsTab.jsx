import React, { useState } from 'react';
import { FiStar, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { confirmDelete } from '../../../../utils/toastUtils';

const ReviewsTab = ({ modalMode, formData, setFormData }) => {
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: '5',
    comment: ''
  });

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({ userName: '', rating: '5', comment: '' });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddReview = () => {
    if (newReview.userName.trim() && newReview.comment.trim()) {
      const reviewObj = {
        id: Date.now(),
        userName: newReview.userName.trim(),
        rating: Number(newReview.rating),
        comment: newReview.comment.trim()
      };
      setFormData(prev => ({
        ...prev,
        reviews: [reviewObj, ...prev.reviews]
      }));
      setNewReview({ userName: '', rating: '5', comment: '' });
    }
  };

  const startEditReview = (rev) => {
    setEditingReviewId(rev.id);
    setEditReviewData({
      userName: rev.userName,
      rating: String(rev.rating),
      comment: rev.comment
    });
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
  };

  const saveEditReview = () => {
    if (editReviewData.userName.trim() && editReviewData.comment.trim()) {
      setFormData(prev => ({
        ...prev,
        reviews: prev.reviews.map(r => 
          r.id === editingReviewId 
            ? { ...r, userName: editReviewData.userName.trim(), rating: Number(editReviewData.rating), comment: editReviewData.comment.trim() } 
            : r
        )
      }));
      setEditingReviewId(null);
    }
  };

  const removeReview = (id) => {
    confirmDelete(() => {
      setFormData(prev => ({
        ...prev,
        reviews: prev.reviews.filter(rev => rev.id !== id)
      }));
    }, 'Are you sure you want to delete this review?');
  };

  return (
    <div className="flex flex-col gap-6">
      {modalMode !== 'view' && (
        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
          <h4 className="text-sm font-bold text-gray-800 mb-3">Add New Review</h4>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                name="userName"
                value={newReview.userName}
                onChange={handleReviewChange}
                placeholder="Reviewer Name" 
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
              />
              <select 
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <textarea 
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              rows={2} 
              placeholder="Review comment..." 
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-gray-900"
            />
            <button 
              onClick={handleAddReview}
              disabled={!newReview.userName.trim() || !newReview.comment.trim()}
              className="self-end px-4 py-2 text-sm bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Review
            </button>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3">Existing Reviews</h4>
        <div className="flex flex-col gap-3">
          {formData.reviews.length > 0 ? (
            formData.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                {editingReviewId === rev.id ? (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        name="userName"
                        value={editReviewData.userName}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-yellow-500 text-gray-900"
                      />
                      <select 
                        name="rating"
                        value={editReviewData.rating}
                        onChange={handleEditChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-yellow-500 bg-white text-gray-900"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <textarea 
                      name="comment"
                      value={editReviewData.comment}
                      onChange={handleEditChange}
                      rows={2} 
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-yellow-500 resize-none text-gray-900"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEdit} className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 rounded">
                        <FiX size={16} />
                      </button>
                      <button onClick={saveEditReview} disabled={!editReviewData.userName.trim() || !editReviewData.comment.trim()} className="p-1 text-green-600 hover:text-green-800 bg-green-50 rounded disabled:opacity-50">
                        <FiCheck size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{rev.userName}</h5>
                        <div className="flex gap-1 mt-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} size={12} className={i < rev.rating ? 'fill-current' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                      {modalMode !== 'view' && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEditReview(rev)}
                            className="text-gray-400 hover:text-blue-500 p-1"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => removeReview(rev.id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{rev.comment}</p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              No reviews added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;
