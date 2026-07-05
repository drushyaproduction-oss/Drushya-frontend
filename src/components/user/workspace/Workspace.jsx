import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import AOS from 'aos';
import { fetchBannersApi } from '../../../api/banner';

const initialGallery = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    title: 'Main Studio',
    description: 'Our primary shooting area equipped with state-of-the-art lighting.',
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
    title: 'Client Lounge',
    description: 'A comfortable space to discuss ideas and review portfolios.',
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1200&auto=format&fit=crop',
    title: 'Editing Bay',
    description: 'Where the magic happens post-production.',
  },
  {
    id: 4,
    thumbnail: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5d1?q=80&w=1200&auto=format&fit=crop',
    title: 'Props Room',
    description: 'Extensive collection of props and backdrops for every occasion.',
  },
  {
    id: 5,
    thumbnail: 'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=1200&auto=format&fit=crop',
    title: 'Makeup & Wardrobe',
    description: 'Dedicated styling area for your convenience.',
  },
  {
    id: 6,
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200&auto=format&fit=crop',
    title: 'Conference Room',
    description: 'Professional setting for corporate project planning.',
  }
];

import { fetchWorkspacesApi } from '../../../api/workspace';
import { getImageUrl } from '../../../config';

const Workspace = () => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    
    const loadData = async () => {
      try {
        const [bannerRes, workspaceRes] = await Promise.all([
          fetchBannersApi('Workspace'),
          fetchWorkspacesApi()
        ]);
        
        if (bannerRes?.data?.success) {
          const active = bannerRes.data.data.filter(b => b.status === 'Active');
          setBannerImages(active.map(b => ({
            ...b,
            thumbnail: b.imageUrl || '' // Map imageUrl to thumbnail for the template
          })));
        }

        if (workspaceRes?.success) {
          const activeWorkspaces = workspaceRes.data.filter(w => w.status === 'Active');
          setGallery(activeWorkspaces);
        }
      } catch (error) {
        console.error('Failed to load workspace data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const bannerTemplate = (item) => {
    return (
      <div className="relative w-full h-[85vh]">
        <img
          src={item.thumbnail}
          alt={item.alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none">
          <div className="mt-12 animate-[fadeIn_1s_ease-out]">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-widest uppercase text-yellow-400 drop-shadow-2xl">
              {item.title || 'Our Workspace'}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto font-light drop-shadow-lg text-gray-100">
              {item.subtitle || 'A creative environment designed to inspire and produce exceptional results.'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Top Slider Banner */}
      <div className="relative w-full h-[85vh] bg-black shadow-lg">
        <Carousel
          value={bannerImages}
          numVisible={1}
          numScroll={1}
          circular
          autoplayInterval={4000}
          itemTemplate={bannerTemplate}
          className="hero-carousel"
          showNavigators={false}
          showIndicators={true}
        />
      </div>

      {/* Workspace Gallery Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-16" data-aos="fade-up">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Office Photos</h4>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Inside Drushya's</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Take a tour of our state-of-the-art facilities where creativity comes to life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((item, index) => (
            <div 
              key={item._id} 
              className="group relative rounded-2xl overflow-hidden shadow-lg bg-white"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-72 w-full overflow-hidden bg-gray-200">
                <img 
                  src={getImageUrl(item.imageUrl)} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-5 bg-white group-hover:bg-gray-50 transition-colors duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {gallery.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No workspace photos available right now. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
