import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../../ui/common/ServiceCard';

const weddingServices = [
  {
    id: 'wedding',
    title: 'Wedding Ceremony',
    description: 'We capture the magic of your special day, creating a beautiful narrative of love, joy, and unforgettable moments.',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'prewedding',
    title: 'Pre-wedding Shoots',
    description: 'Tell your love story before the big day. We find cinematic locations to capture your romance in a relaxed environment.',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'engagement',
    title: 'Engagements',
    description: 'The moment you say yes! We discretely capture the surprise and emotion of your perfect proposal or engagement party.',
    thumbnail: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'reception',
    title: 'Receptions & Parties',
    description: 'Dance the night away! We make sure all the fun, laughter, and spectacular details of your reception are perfectly documented.',
    thumbnail: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
  }
];

const Weddings = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
          alt="Weddings Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium">
            Wedding Photography
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
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Weddings, Pre-weddings & Engagements</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">We offer cinematic wedding packages designed to document every precious milestone of your love story.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {weddingServices.map((service) => (
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

export default Weddings;
