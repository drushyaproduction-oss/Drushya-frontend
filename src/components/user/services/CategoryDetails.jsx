import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceCard from '../../../ui/common/ServiceCard';
import { getCategoryBySlug } from '../../../api/category';
import { getServicesByCategory } from '../../../api/service';
import { getImageUrl } from '../../../config';

const CategoryDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // First get category by slug
      const catData = await getCategoryBySlug(slug);
      if (catData && catData.success) {
        setCategory(catData.data);
        
        // Then get services for this category
        const srvData = await getServicesByCategory(catData.data._id);
        if (srvData && srvData.success) {
          // Filter out inactive services
          const activeServices = srvData.data.filter(s => s.status !== 'Inactive');
          setServices(activeServices);
        }
      } else {
        navigate('/services');
      }
    } catch (error) {
      console.error("Failed to fetch category details", error);
      navigate('/services');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src={getImageUrl(category.thumbnail)}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium text-center px-4">
            {category.name}
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <div className="mb-8 flex justify-start">
          <button 
            onClick={() => navigate('/services')} 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
             Back to Categories
          </button>
        </div>
        <div className="text-center mb-16" data-aos="fade-up">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Our Specialities</h4>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">{category.name} Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">{category.description}</p>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {services.map((service) => (
              <ServiceCard 
                key={service._id}
                title={service.name}
                description={service.description}
                thumbnail={getImageUrl(service.thumbnail)}
                link={`/packages/service/${service._id}`}
                buttonText="View Packages"
                secondaryButtonText="Gallery"
                secondaryLink={`/gallery/${service._id}`}
                isTrending={service.isTrending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
             <p className="text-gray-500">No services available for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetails;
