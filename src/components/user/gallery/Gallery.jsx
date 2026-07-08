import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'primereact/carousel';
import { getServiceById, getServicesByCategory } from '../../../api/service';
import { getImageUrl } from '../../../config';
import ServiceCard from '../../../ui/common/ServiceCard';

const Gallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('images');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await getServiceById(id);
        if (res && res.success) {
          setService(res.data);
          
          if (res.data.categoryId) {
            const relatedRes = await getServicesByCategory(res.data.categoryId);
            if (relatedRes && relatedRes.success) {
              const activeRelated = relatedRes.data.filter(s => s.status !== 'Inactive' && s._id !== res.data._id);
              setRelatedServices(activeRelated);
            }
          }
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch service details');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
        fetchService();
    }
  }, [id]);

  const gridImagesCount = service?.gallery?.length || 0;

  const closeFullscreen = () => {
    setFullscreenImageIndex(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (fullscreenImageIndex === null) return;
      if (e.key === 'Escape') {
        setFullscreenImageIndex(null);
        document.body.style.overflow = '';
      }
      if (e.key === 'ArrowRight') setFullscreenImageIndex((prev) => (prev + 1) % gridImagesCount);
      if (e.key === 'ArrowLeft') setFullscreenImageIndex((prev) => (prev - 1 + gridImagesCount) % gridImagesCount);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImageIndex, gridImagesCount]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-xl text-gray-600">{error || 'Service not found'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-6 py-2 bg-yellow-500 text-white rounded-full font-bold hover:bg-yellow-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Use banners if available, fallback to thumbnail
  const bannerImages = service.banners && service.banners.length > 0 
    ? service.banners.map(b => getImageUrl(b)) 
    : [getImageUrl(service.thumbnail)];

  const gridImages = service.gallery && service.gallery.length > 0 
    ? service.gallery.map(g => getImageUrl(g))
    : [];

  const bannerVideo = service.bannerVideo;

  const bannerTemplate = (itemSrc) => {
    return (
      <div className="relative w-full h-[85vh]">
        <img
          src={itemSrc}
          alt="Gallery Banner"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-16 bg-black/40 pointer-events-none" data-aos="zoom-in" data-aos-duration="1000">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium capitalize">
            {service.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl font-light">
            Explore our curated collection of moments and memories.
          </p>
          <div className="w-24 h-0.5 bg-yellow-400 mt-8"></div>
        </div>
      </div>
    );
  };

  const openFullscreen = (index) => {
    setFullscreenImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setFullscreenImageIndex((prevIndex) => (prevIndex + 1) % gridImages.length);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setFullscreenImageIndex((prevIndex) => (prevIndex - 1 + gridImages.length) % gridImages.length);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Banner Section */}
      <div className="relative w-full h-[85vh] bg-black overflow-hidden group">
        {viewMode === 'images' ? (
          <Carousel
            value={bannerImages}
            numVisible={1}
            numScroll={1}
            circular
            autoplayInterval={4000}
            itemTemplate={bannerTemplate}
            className="hero-carousel"
            showNavigators={false}
            showIndicators={bannerImages.length > 1}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            {bannerVideo ? (
              <iframe
                src={`${bannerVideo}?autoplay=1&rel=0`}
                title={`${service.name} Video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full object-cover"
              ></iframe>
            ) : (
              <p className="text-white text-xl">No video available for this service.</p>
            )}
          </div>
        )}

        {/* Video / Photo Toggle Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex bg-white/20 backdrop-blur-md p-1.5 rounded-full border border-white/30 shadow-2xl">
          <button 
            onClick={() => setViewMode('images')}
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 tracking-wide ${viewMode === 'images' ? 'bg-white shadow text-gray-900' : 'text-white hover:text-gray-200 hover:bg-white/10'}`}
          >
            Photos
          </button>
          {bannerVideo && (
            <button 
              onClick={() => setViewMode('videos')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 tracking-wide ${viewMode === 'videos' ? 'bg-white shadow text-gray-900' : 'text-white hover:text-gray-200 hover:bg-white/10'}`}
            >
              Watch Video
            </button>
          )}
        </div>
      </div>

      {/* Photo Grid Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        
        <div className="mb-8 flex justify-start">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow hover:shadow-md"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Back to Portfolios
          </button>
        </div>

        {/* Masonry CSS Grid Layout - Always Photos */}
        {gridImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
            {gridImages.map((src, index) => (
              <div 
                key={`img-${index}`} 
                className="break-inside-avoid mb-6 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300" 
                data-aos="fade-up" 
                data-aos-delay={(index % 4) * 100}
                onClick={() => openFullscreen(index)}
              >
                <img
                  src={src}
                  alt={`${service.name} gallery ${index + 1}`}
                  className="w-full block h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <i className="pi pi-image text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 text-lg">No gallery images available for this service yet.</p>
          </div>
        )}
      </div>

      {/* Related Services Section */}
      {relatedServices.length > 0 && (
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-10">
          <div className="flex items-center justify-between mb-8" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-gray-900">Explore Related Services</h3>
            <div className="h-0.5 flex-grow bg-gray-200 ml-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch pb-10" data-aos="fade-up" data-aos-delay="100">
            {relatedServices.map((relService) => (
              <ServiceCard 
                key={relService._id}
                title={relService.name}
                description={relService.description}
                thumbnail={getImageUrl(relService.thumbnail)}
                link={`/packages/service/${relService._id}`}
                buttonText="View Packages"
                secondaryButtonText="Gallery"
                secondaryLink={`/gallery/${relService._id}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeFullscreen}
        >
          {/* Main Image */}
          <div className="relative w-full h-[85vh] flex items-center justify-center p-4 md:p-8">
            <img
              src={gridImages[fullscreenImageIndex]}
              alt={`Fullscreen ${fullscreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-md select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={prevImage}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors shadow-lg"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <button 
              onClick={closeFullscreen}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors shadow-lg"
              aria-label="Close fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <button 
              onClick={nextImage}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-colors shadow-lg"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
