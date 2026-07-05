import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../../../ui/common/Button';
import { createContactApi } from '../../../api/contact';
import { getAllCategories } from '../../../api/category';
import { fetchBannersApi } from '../../../api/banner';
import { getImageUrl } from '../../../config';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    studioLocation: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [categories, setCategories] = useState([]);
  
  const [banner, setBanner] = useState({
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
    title: "Contact Us"
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, bannerRes] = await Promise.all([
          getAllCategories(),
          fetchBannersApi('Contact')
        ]);
        
        if (categoriesRes && categoriesRes.success) {
          setCategories(categoriesRes.data);
        }
        
        if (bannerRes.data?.success && bannerRes.data.data?.length > 0) {
          const activeBanner = bannerRes.data.data.find(b => b.status === 'Active') || bannerRes.data.data[0];
          setBanner({
            imageUrl: getImageUrl(activeBanner.imageUrl),
            title: activeBanner.title || "Contact Us"
          });
        }
      } catch (error) {
        console.error("Failed to load initial contact data", error);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.mobile || !formData.subject || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.mobile,
        studioLocation: formData.studioLocation,
        subject: formData.subject,
        message: formData.message
      };

      await createContactApi(payload);
      
      setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        studioLocation: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium">
            {banner.title}
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      {/* Contact Content Section - Half Image Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 overflow-hidden rounded-2xl shadow-xl bg-white border border-gray-100">
          
          {/* Left Side: Contact Information */}
          <div className="p-8 md:p-12 lg:col-span-2 bg-gray-50 flex flex-col justify-center border-r border-gray-100" data-aos="fade-right">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 font-light text-base">
                We'd love to hear about your upcoming project or event. Reach out to us to capture your most precious moments.
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Locations */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex-shrink-0 flex items-center justify-center text-yellow-600 mt-1">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-900 uppercase tracking-wider font-semibold mb-4">Studio Locations</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-900 font-medium">Drushya Productions</p>
                      <p className="text-gray-500 text-sm">Baner, Pune</p>
                      <a href="https://maps.app.goo.gl/auy9TwgFgL5ZXvL5A" target="_blank" rel="noopener noreferrer" className="text-yellow-600 text-sm hover:text-yellow-500 hover:underline mt-1 inline-block font-medium">View on Map &rarr;</a>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">The Rishi Studio</p>
                      <p className="text-gray-500 text-sm">Savedi, Ahilyanagar</p>
                      <a href="https://maps.app.goo.gl/bcCMyUS5wVj1hTk67" target="_blank" rel="noopener noreferrer" className="text-yellow-600 text-sm hover:text-yellow-500 hover:underline mt-1 inline-block font-medium">View on Map &rarr;</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex-shrink-0 flex items-center justify-center text-yellow-600 mt-1">
                  <FaPhoneAlt size={18} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-900 uppercase tracking-wider font-semibold mb-2">Contact Number</h4>
                  <div className="space-y-1">
                    <p className="text-gray-600">+91 9158212338</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-yellow-50 flex-shrink-0 flex items-center justify-center text-yellow-600 mt-1">
                  <FaEnvelope size={18} />
                </div>
                <div>
                  <h4 className="text-sm text-gray-900 uppercase tracking-wider font-semibold mb-2">Email Address</h4>
                  <div className="space-y-1">
                    <p className="text-gray-600">rushikeshl1998@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-12 lg:col-span-3 flex flex-col justify-center bg-white" data-aos="fade-left">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h3>
              <p className="text-gray-500 font-light text-sm">Fill out the form below and our team will get back to you shortly.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {submitStatus.message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">First Name *</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                    placeholder="e.g., Jane"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                    placeholder="e.g., Smith"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                    placeholder="e.g., jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 font-medium">Mobile Number *</label>
                  <input 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300"
                    placeholder="e.g., +91 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Studio Location *</label>
                <select 
                  name="studioLocation"
                  value={formData.studioLocation}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 appearance-none"
                >
                  <option value="" disabled>Select a Studio Location</option>
                  <option value="Drushya Productions">Drushya Productions</option>
                  <option value="Rishi's Studio">Rishi's Studio</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Service of Interest *</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 appearance-none"
                >
                  <option value="">Select a service...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.title || category.name}>
                      {category.title || category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Message *</label>
                <textarea 
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 resize-none"
                  placeholder="How can we help bring your vision to life?"
                ></textarea>
              </div>
              
              <Button type="submit" variant="primary" fullWidth className="mt-2 text-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
        </div>
      </div>

      {/* Maps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-10" data-aos="fade-up">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Find Us on the Map</h3>
          <p className="text-gray-600 font-light text-lg">Visit our premium studios located conveniently in Pune and Ahilyanagar.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Baner Location */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100" data-aos="fade-up">
            <h4 className="text-xl font-bold text-gray-900 mb-3 ml-2">Drushya Productions (Pune)</h4>
            <div className="rounded-xl overflow-hidden shadow-inner h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.113698662765!2d73.7752557!3d18.568912100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9b317a7f61d%3A0x1bed4670c71009b0!2sDRUSHYA%20PRODUCTIONS%20%26%20STUDIO!5e0!3m2!1sen!2sin!4v1782657182306!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          
          {/* Ahilyanagar Location */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100" data-aos="fade-up" data-aos-delay="100">
            <h4 className="text-xl font-bold text-gray-900 mb-3 ml-2">The Rishi Studio (Ahilyanagar)</h4>
            <div className="rounded-xl overflow-hidden shadow-inner h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5073431478377!2d74.735083!3d19.129256899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdcbb3b8b545ee1%3A0xb41ae4b5132e8aaf!2sThe%20Rishi%20studio!5e0!3m2!1sen!2sin!4v1782657247423!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
