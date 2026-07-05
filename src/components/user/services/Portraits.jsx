import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../../ui/common/ServiceCard';

const portraitServices = [
  {
    id: 'maternity',
    title: 'Maternity',
    description: 'Celebrate the beautiful journey of motherhood. We create elegant and timeless portraits that capture the glow and anticipation of this special time.',
    thumbnail: 'https://images.unsplash.com/photo-1596484552835-09bd2d9e79ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'newborn',
    title: 'Newborn',
    description: 'Those first few weeks are magical. Our gentle and safe newborn sessions capture the tiny details and pure innocence of your newest family member.',
    thumbnail: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'kids',
    title: 'Kids',
    description: 'Fun, energetic, and candid! We let kids be kids, capturing their genuine smiles and playful personalities in vibrant photographs.',
    thumbnail: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'family',
    title: 'Family',
    description: 'Gather your loved ones for a heartwarming session. We focus on the unique connection and love your family shares, creating heirlooms for generations.',
    thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
  }
];

const Portraits = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop"
          alt="Portraits Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium">
            Portrait Photography
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
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Maternity, Newborn, Kids & Family</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">We offer a variety of portrait sessions designed to document every precious milestone of your family's story.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {portraitServices.map((service) => (
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

export default Portraits;
