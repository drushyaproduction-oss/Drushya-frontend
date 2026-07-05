import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../../ui/layout/Sidebar';
import Header from '../../../ui/layout/Header';
import { FiImage, FiSave } from 'react-icons/fi';
import { fetchAboutProfileApi, saveAboutProfileApi } from '../../../api/about';
import { getImageUrl } from '../../../config';

const AboutManager = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Rushikesh Lokhande',
    role: 'Lead Photographer & Visionary',
    description1: '',
    description2: '',
    yearsExperience: 10,
    studiosCount: 2,
    professionalExcellence: 100,
    profileImage1: '',
    profileImage2: ''
  });

  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchAboutProfileApi();
      if (data && data.success && data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch about profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (index === 1) {
        setFormData(prev => ({ ...prev, profileImage1: imageUrl }));
        setImageFile1(file);
      } else {
        setFormData(prev => ({ ...prev, profileImage2: imageUrl }));
        setImageFile2(file);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('description1', formData.description1);
      submitData.append('description2', formData.description2);
      submitData.append('yearsExperience', formData.yearsExperience);
      submitData.append('studiosCount', formData.studiosCount);
      submitData.append('professionalExcellence', formData.professionalExcellence);
      
      if (imageFile1) submitData.append('profileImage1', imageFile1);
      if (imageFile2) submitData.append('profileImage2', imageFile2);

      const { data } = await saveAboutProfileApi(submitData);
      if (data && data.success) {
        setFormData(data.data);
        toast.success("About profile updated successfully!");
        setImageFile1(null);
        setImageFile2(null);
      }
    } catch (error) {
      console.error("Failed to save about profile", error);
      toast.error(error.response?.data?.message || "Failed to save. Please try again.");
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
        <Header title="About Profile Management" toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Profile Info</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role / Title</label>
                      <input 
                        type="text" 
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description Paragraph 1</label>
                      <textarea 
                        name="description1"
                        value={formData.description1}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description Paragraph 2</label>
                      <textarea 
                        name="description2"
                        value={formData.description2}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 resize-none text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Years Exp</label>
                        <input 
                          type="number" 
                          name="yearsExperience"
                          value={formData.yearsExperience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Studios</label>
                        <input 
                          type="number" 
                          name="studiosCount"
                          value={formData.studiosCount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Excellence %</label>
                        <input 
                          type="number" 
                          name="professionalExcellence"
                          value={formData.professionalExcellence}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image 1 (Grayscale Effect)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 1)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-yellow-50 file:text-yellow-700 cursor-pointer text-gray-900"
                        />
                        {formData.profileImage1 && (
                          <div className="mt-4 h-48 w-full md:w-2/3 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            <img src={imageFile1 ? formData.profileImage1 : getImageUrl(formData.profileImage1)} alt="Profile 1" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image 2 (Secondary)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 2)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-yellow-50 file:text-yellow-700 cursor-pointer text-gray-900"
                        />
                        {formData.profileImage2 && (
                          <div className="mt-4 h-48 w-full md:w-2/3 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            <img src={imageFile2 ? formData.profileImage2 : getImageUrl(formData.profileImage2)} alt="Profile 2" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    <FiSave size={20} />
                    {isSaving ? 'Saving Changes...' : 'Save Profile Info'}
                  </button>
                </div>
                
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
