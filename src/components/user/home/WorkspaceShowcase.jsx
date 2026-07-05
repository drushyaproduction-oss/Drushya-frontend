import React, { useState, useEffect } from 'react';
import Button from '../../../ui/common/Button';
import { FiArrowRight } from 'react-icons/fi';
import { fetchWorkspacesApi } from '../../../api/workspace';

const WorkspaceShowcase = () => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const response = await fetchWorkspacesApi();
        if (response.data && response.data.length > 0) {
          const activeWorkspaces = response.data.filter(w => w.status === 'Active');
          if (activeWorkspaces.length > 0) {
            const parsed = activeWorkspaces.map(item => ({
              id: item._id,
              thumbnail: item.imageUrl,
              title: item.title,
              description: item.description
            }));
            
            setGallery(parsed.slice(0, 4));
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }
      
      // fallback to local storage
      const saved = localStorage.getItem('drushya_workspace_gallery');
      if (saved) {
        const parsed = JSON.parse(saved).map(item => ({
          ...item,
          thumbnail: item.thumbnail || item.imageSrc || ''
        }));
        setGallery(parsed.slice(0, 4));
      }
    };
    
    loadWorkspaces();
  }, []);

  return (
    <div className="bg-gray-50 py-24 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-400/5 transform skew-x-12 translate-x-1/4"></div>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/3" data-aos="fade-right">
            <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-yellow-600"></span>
              Our Creative Space
            </h4>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 leading-tight">
              Where Magic <br/> Happens
            </h2>
            <p className="text-gray-600 font-light text-lg mb-8 leading-relaxed">
              Step into our state-of-the-art studio designed to inspire creativity and deliver breathtaking results. From expansive shooting floors to cozy client lounges, every corner is crafted to provide you with a premium, comfortable experience.
            </p>
            <Button to="/workspace" variant="outline" className="px-8 py-3 group">
              <span className="flex items-center gap-2">
                Explore Workspace
                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          {/* Gallery Grid */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gallery.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`group relative overflow-hidden rounded-2xl shadow-lg h-72 ${index % 2 !== 0 ? 'md:mt-12' : ''} bg-gray-200`}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  {item.thumbnail && (
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-200 text-sm font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default WorkspaceShowcase;
