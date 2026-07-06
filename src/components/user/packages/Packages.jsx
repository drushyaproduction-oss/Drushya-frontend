import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServiceCard from '../../../ui/common/ServiceCard';
import { getAllPackages } from '../../../api/package';
import { getAllCategories } from '../../../api/category';
import { getAllServices } from '../../../api/service';
import { getImageUrl } from '../../../config';

const Packages = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategoryId = searchParams.get('categoryId') || 'All';
  const initialServiceId = searchParams.get('serviceId') || 'All';

  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState(initialCategoryId);
  const [activeServiceFilter, setActiveServiceFilter] = useState(initialServiceId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('categoryId') || 'All';
    const serviceId = searchParams.get('serviceId') || 'All';
    setActiveFilter(categoryId);
    setActiveServiceFilter(serviceId);
  }, [location.search]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pkgRes, catRes, srvRes] = await Promise.all([
        getAllPackages(),
        getAllCategories(),
        getAllServices()
      ]);
      if (pkgRes && pkgRes.success) setPackages(pkgRes.data);
      if (catRes && catRes.success) setCategories(catRes.data);
      if (srvRes && srvRes.success) setServices(srvRes.data);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  let filteredPackages = activeFilter === 'All' 
    ? packages 
    : packages.filter(pkg => pkg.categoryId === activeFilter);
    
  if (activeServiceFilter !== 'All') {
    filteredPackages = filteredPackages.filter(pkg => (pkg.subCategoryId === activeServiceFilter || pkg.serviceId === activeServiceFilter));
  }
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] bg-black">
        <img
          src="/images/home_banner1.jpg"
          alt="Packages Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium">
            Pricing & Packages
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20">
        <div className="text-center mb-12" data-aos="fade-up">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Our Offerings</h4>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Discover Your Perfect Package</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Browse our complete collection of photography and cinematography packages, designed to meet your every need.</p>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col items-center justify-center mb-16" data-aos="fade-up" data-aos-delay="100">
          <div className="flex items-center space-x-3 mb-6">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            <span className="text-gray-600 font-semibold uppercase tracking-widest text-sm">Filter Packages by Category</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <button
              onClick={() => {
                setActiveFilter('All');
                setActiveServiceFilter('All');
              }}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === 'All' 
                  ? 'bg-yellow-400 text-black shadow-lg scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-yellow-400 hover:text-yellow-600 shadow-sm'
              }`}
            >
              All Packages
            </button>
            {categories.map((filter) => (
              <button
                key={filter._id}
                onClick={() => {
                  setActiveFilter(filter._id);
                  setActiveServiceFilter('All');
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter._id 
                    ? 'bg-yellow-400 text-black shadow-lg scale-105' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-yellow-400 hover:text-yellow-600 shadow-sm'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
          
          {/* Secondary SubCategory (Service) Filter */}
          {activeFilter !== 'All' && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 animate-fade-in-up">
              <button
                onClick={() => setActiveServiceFilter('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeServiceFilter === 'All' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-800 hover:text-gray-800'
                }`}
              >
                All Services
              </button>
              {services.filter(s => s.categoryId === activeFilter).map((service) => (
                <button
                  key={service._id}
                  onClick={() => setActiveServiceFilter(service._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeServiceFilter === service._id 
                      ? 'bg-gray-800 text-white shadow-md' 
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-800 hover:text-gray-800'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {filteredPackages.map((pkg) => {
              const catName = categories.find(c => c._id === pkg.categoryId)?.name || 'Category';
              const srvName = services.find(s => s._id === (pkg.subCategoryId || pkg.serviceId))?.name || 'Service';
              
              return (
                <ServiceCard 
                  key={pkg._id}
                  title={pkg.title}
                  subtitle={`${catName}  •  ${srvName}`}
                  description={pkg.description}
                  thumbnail={getImageUrl(pkg.coverImage)}
                  link={`/packages/${pkg._id}`}
                  buttonText="View Details"
                  secondaryButtonText="Gallery"
                  secondaryLink={`/gallery/${pkg.subCategoryId || pkg.serviceId}`}
                  isTrending={pkg.isTrending}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500">No packages found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
