import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../../ui/common/ServiceCard';

const corporateServices = [
  {
    id: 'events',
    title: 'Corporate Events',
    description: 'From annual galas to large conferences, we document your professional events with a keen eye for branding and networking moments.',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'branding',
    title: 'Brand Identity',
    description: 'Showcase your company culture. We create compelling visual narratives that communicate your values to clients and top talent.',
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'promotions',
    title: 'Promotional Campaigns',
    description: 'High-impact visuals designed for your marketing channels, ensuring your brand stands out in a crowded marketplace.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'headshots',
    title: 'Professional Headshots',
    description: 'Make a great first impression. We provide high-end corporate headshots for your leadership team and entire staff.',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
  }
];

const Corporate = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1497361413813-f66159f81fb3?q=80&w=2000&auto=format&fit=crop"
          alt="Corporate Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium">
            Corporate Photography
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <div className="mb-8 flex justify-start">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Back to Services
          </button>
        </div>
        <div className="text-center mb-16" data-aos="fade-up">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Our Specialities</h4>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Events, Branding, Promotions & Headshots</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Elevate your business profile with our comprehensive suite of corporate visual services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {corporateServices.map((service) => (
            <ServiceCard 
              key={service.id}
              title={service.title}
              description={service.description}
              thumbnail={service.thumbnail}
              link={`/packages/${service.id}`}
              buttonText="View Package"
              secondaryButtonText="Gallery"
              secondaryLink={`/gallery/${service.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Corporate;
