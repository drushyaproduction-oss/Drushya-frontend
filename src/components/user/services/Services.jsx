import React, { useEffect, useState } from 'react';
import ServiceCard from '../../../ui/common/ServiceCard';
import { getAllCategories } from '../../../api/category';
import { getImageUrl } from '../../../config';

const Services = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories();
      if (data && data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2000&auto=format&fit=crop"
          alt="Services Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium">
            Our Services
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <div className="text-center mb-16" data-aos="fade-up">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">What We Do</h4>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Premium Photography Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Choose from our range of specialized services tailored to capture your exact needs with precision and creativity.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {categories.map((cat) => (
              <ServiceCard 
                key={cat._id}
                title={cat.name}
                subtitle=""
                description={cat.description}
                thumbnail={getImageUrl(cat.thumbnail)}
                link={`/services/${cat.slug}`}
                buttonText="View More"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No categories found. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
