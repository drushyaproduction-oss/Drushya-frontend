import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackageById, getPackageBySubcategory, getPackagesByCategory } from '../../../api/package';
import { createBookingRequest } from '../../../api/booking';
import { createReview, getReviewsByPackage } from '../../../api/review';
import { getImageUrl } from '../../../config';
import Button from '../../../ui/common/Button';
import ServiceCard from '../../../ui/common/ServiceCard';

const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-3">
      <div 
        className="bg-gray-50 p-4 rounded-lg flex justify-between items-center cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="18 15 12 9 6 15"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
        )}
      </div>
      {isOpen && (
        <div className="px-4 py-4 text-sm text-gray-600 border border-gray-100 rounded-b-lg border-t-0 -mt-2 bg-white pt-6">
          <ul className="space-y-2">
             {content.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-400 mr-2 mt-1 text-[10px]">●</span>
                  {item}
                </li>
             ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const BookingModal = ({ isOpen, onClose, packageName, packageId }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    mobile: '',
    eventDate: '',
    eventLocation: '',
    studioLocation: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const submitData = {
        ...formData,
        packageId,
      };
      const res = await createBookingRequest(submitData);
      if (res && res.success) {
        toast.success('Booking Request Submitted Successfully!');
        onClose();
        setFormData({ customerName: '', email: '', mobile: '', eventDate: '', eventLocation: '', studioLocation: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Session</h2>
          <p className="text-sm text-gray-500">You are booking the <span className="font-semibold text-yellow-500">{packageName}</span> package. Fill out the form below and we will get back to you shortly.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="e.g., Jane Smith"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g., jane@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="e.g., +91 98765 43210"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
              <input 
                type="date" 
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all text-gray-700 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                required
                placeholder="e.g., Central Park, NY"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Studio Location</label>
            <select
              name="studioLocation"
              value={formData.studioLocation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all text-gray-700 bg-white"
            >
              <option value="" disabled>Select a Studio Location</option>
              <option value="Drushya Productions">Drushya Productions</option>
              <option value="Rishi's Studio">Rishi's Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements / Message</label>
            <textarea 
              rows="2"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please share details about your vision, preferred locations, or specific requests..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isLoading}
              className={`py-3 text-base font-bold shadow-lg shadow-yellow-400/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Submitting...' : 'Submit Booking Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewSection = ({ packageName, packageId, categoryId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '', mobile: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (packageId) fetchReviews();
  }, [packageId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await getReviewsByPackage(packageId);
      if (res && res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || !newReview.mobile) return;
    setIsSubmitting(true);
    try {
      const reviewData = {
        categoryId,
        packageId,
        customerName: newReview.name,
        mobile: newReview.mobile,
        rating: newReview.rating,
        review: newReview.comment
      };
      const res = await createReview(reviewData);
      if (res && res.success) {
        setReviews([res.data, ...reviews]);
        setNewReview({ name: '', rating: 5, comment: '', mobile: '' });
        toast.success('Thank you for your review!');
      }
    } catch (err) {
      console.error('Failed to submit review', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit review';
      toast.error(`Error: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
        Reviews for {packageName}
      </h3>
      
      {/* Review Form */}
      <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10 border border-gray-100 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className={`focus:outline-none transition-colors ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={star <= newReview.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={newReview.mobile}
                onChange={(e) => setNewReview({ ...newReview, mobile: e.target.value })}
                placeholder="e.g., 9876543210"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              required
              rows="3"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Tell us about your experience..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all resize-none"
            ></textarea>
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className={`py-2.5 px-6 text-sm font-bold shadow-md shadow-yellow-400/20 ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h5 className="font-bold text-gray-900">{review.customerName}</h5>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-0.5 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={star <= review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PackageDetails = () => {
  const { id, serviceId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedPackages, setRelatedPackages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id, serviceId]);

  const fetchData = async () => {
    try {
      let res;
      if (serviceId) {
        res = await getPackageBySubcategory(serviceId);
      } else if (id) {
        res = await getPackageById(id);
      }
      
      if (res && res.success) {
        setData(res.data);
        if (res.data.categoryId) {
          const relatedRes = await getPackagesByCategory(res.data.categoryId);
          if (relatedRes && relatedRes.success) {
            const activeRelated = relatedRes.data.filter(p => p._id !== res.data._id);
            setRelatedPackages(activeRelated);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch package:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center bg-white">
        <h2 className="text-2xl font-bold mb-4">Package not found</h2>
        <Button onClick={() => navigate('/packages')} variant="primary">Back to Packages</Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 font-sans pb-20">
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        packageName={data.title}
        packageId={data._id}
      />
      
      {/* Hero Banner */}
      <div className="relative w-full h-[85vh] bg-black mb-12">
        <img
          src={getImageUrl(data.coverImage) || "/images/home_banner1.jpg"}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/home_banner1.jpg';
          }}
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-16 pointer-events-none" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium capitalize">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light">
            {data.description}
          </p>
          <div className="w-24 h-0.5 bg-yellow-400 mt-8"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:gap-16 lg:items-start">
        
        {/* Left Column - Main Content */}
        <div className="lg:w-[65%]">
          
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Go Back
          </button>

          {/* Tags */}
          <div className="flex items-center gap-4 mb-8 text-sm pt-2" data-aos="fade-right">
            <span className="flex items-center text-gray-700 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
              {data.status || 'Active'}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold text-xs tracking-wide">
              {data.isTrending ? 'Trending' : 'Standard'}
            </span>
          </div>

          {/* Benefits Box */}
          {data.benefits && data.benefits.length > 0 && (
            <div className="border border-gray-100 rounded-2xl p-6 md:p-8 mb-8 shadow-sm hover:shadow-md transition-shadow" data-aos="fade-up">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between text-gray-900">
                Our Package Benefits
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {data.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 mr-3 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {benefit}
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements Box - Highlighted */}
          {data.requirements && data.requirements.length > 0 && (
            <div className="border-2 border-blue-400 bg-blue-50/30 rounded-2xl p-6 md:p-8 mb-8 shadow-sm relative" data-aos="fade-up">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between text-gray-900">
                Requirements
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#bfdbfe" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </h3>
              <ul className="space-y-3">
                {data.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start text-xs text-gray-700 font-medium">
                      <span className="text-blue-400 mr-2 mt-[2px] text-[10px]">●</span>
                      {req}
                    </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum / Itinerary Accordion */}
          {data.itinerary && data.itinerary.length > 0 && (
            <div className="border border-gray-100 rounded-2xl p-6 md:p-8 mb-8 shadow-sm" data-aos="fade-up">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between text-gray-900">
                The Itinerary
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </h3>
              <div className="space-y-1">
                {data.itinerary.map((module, idx) => (
                  <AccordionItem 
                    key={idx} 
                    title={module.phase} 
                    content={module.items} 
                    defaultOpen={idx === 0} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Review Section */}
          <ReviewSection 
            packageName={data.title} 
            packageId={data._id}
            categoryId={data.categoryId}
          />

        </div>

        {/* Right Column - Sticky Sidebar */}
        <div className="lg:w-[35%] sticky top-24 mt-12 lg:mt-0" data-aos="fade-left">
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
            {/* Decorative Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"></div>
            
            <h3 className="text-2xl font-bold text-center mb-1 text-gray-900 mt-1">
              Ready to Book?
            </h3>
            <p className="text-center text-sm text-gray-500 mb-5 font-medium">Secure your preferred date and time.</p>
            
            <div className="text-center mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-400 line-through text-sm font-semibold mb-1">INR {Math.round(data.price * 1.2)}</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">INR {data.price}</p>
              <p className="text-xs text-green-600 font-bold mt-1 uppercase tracking-wider">Limited Time Offer</p>
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="primary" 
              fullWidth 
              className="py-3 text-base font-bold uppercase tracking-widest shadow-xl shadow-yellow-400/20 mb-3"
            >
              Book Now
            </Button>
            
            <p className="text-center text-xs text-gray-500 mb-5 font-medium flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              100% Satisfaction Guarantee
            </p>
            
            {data.features && data.features.length > 0 && (
              <div className="pt-5 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">What's Included</h4>
                <ul className="space-y-3 text-sm text-gray-600 font-medium">
                  {data.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 group-hover:bg-yellow-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="leading-tight pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Related Packages Section */}
      {relatedPackages.length > 0 && (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="flex items-center justify-between mb-8" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-gray-900">Explore Related Packages</h3>
            <div className="h-0.5 flex-grow bg-gray-200 ml-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pb-10" data-aos="fade-up" data-aos-delay="100">
            {relatedPackages.map((pkg) => (
              <ServiceCard 
                key={pkg._id}
                title={pkg.title}
                subtitle="Related Package"
                description={pkg.description}
                thumbnail={getImageUrl(pkg.coverImage)}
                link={`/packages/${pkg._id}`}
                buttonText="View Details"
                secondaryButtonText="Gallery"
                secondaryLink={`/gallery/${pkg.subCategoryId?._id || pkg.subCategoryId || pkg.serviceId}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;
