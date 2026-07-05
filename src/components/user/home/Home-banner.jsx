import React, { useState, useEffect } from 'react';
import { Carousel } from 'primereact/carousel';
import Reviews from './Reviews';
import PromoBanner from '../about/PromoBanner';
import PhotographyShowcase from './PhotographyShowcase';
import FeatureShowcase from './FeatureShowcase';
import WorkspaceShowcase from './WorkspaceShowcase';
import ServiceCard from '../../../ui/common/ServiceCard';
import Button from '../../../ui/common/Button';
import { fetchBannersApi } from '../../../api/banner';
import { getAllCategories } from '../../../api/category';
import { getTrendingServices } from '../../../api/service';
import { getAllPackages } from '../../../api/package';
import { getImageUrl } from '../../../config';

const HomeBanner = () => {
  const [bannerImages, setBannerImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendingServices, setTrendingServices] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bannerData, catData, trendingData, pkgData] = await Promise.all([
          fetchBannersApi('Home'),
          getAllCategories(),
          getTrendingServices(),
          getAllPackages()
        ]);

        if (bannerData && bannerData.data && bannerData.data.success) {
          const active = bannerData.data.data.filter(b => b.status === 'Active');
          setBannerImages(active.map(b => ({
            ...b,
            thumbnail: b.imageUrl || ''
          })));
        }

        if (catData && catData.success) {
          setCategories(catData.data);
        }

        if (trendingData && trendingData.success) {
          setTrendingServices(trendingData.data.slice(0, 4));
        }

        if (pkgData && pkgData.success) {
          setFeaturedPackages(pkgData.data.filter(p => p.isTrending).slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const bannerTemplate = (item) => {
    return (
      <div className="relative w-full h-screen">
        <img
          src={getImageUrl(item.thumbnail)}
          alt={item.alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 pt-20 bg-black/30 pointer-events-none" data-aos="zoom-in" data-aos-duration="1000">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-widest uppercase text-yellow-400 drop-shadow-2xl">
            {item.title || 'Capture The Moment'}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl font-light drop-shadow-lg text-gray-100">
            {item.subtitle || 'Professional photography services for your most precious memories.'}
          </p>
        </div>
      </div>
    );
  };


  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="relative w-full h-screen bg-black">
        <Carousel
          value={bannerImages}
          numVisible={1}
          numScroll={1}
          circular
          autoplayInterval={4000}
          itemTemplate={bannerTemplate}
          className="hero-carousel"
          showNavigators={false}
        />
      </div>

      <PhotographyShowcase />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16">
        <div className="text-center mb-16" data-aos="fade-up">
          <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Most Popular</h4>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Trending Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Discover the top photography services our clients are currently booking the most.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch mb-10" data-aos="fade-up" data-aos-delay="100">
          {trendingServices.map((service) => (
            <ServiceCard
              key={service._id}
              title={service.name}
              subtitle={categories.find(c => c._id === service.categoryId)?.name || ""}
              description={service.description}
              thumbnail={getImageUrl(service.thumbnail)}
              link={`/services/${categories.find(c => c._id === service.categoryId)?.slug || ""}`}
              buttonText="Learn More"
            />
          ))}
        </div>
        {trendingServices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mb-10">
            <p className="text-gray-500">Check back later for our trending services!</p>
          </div>
        )}
        <div className="text-center">
          <Button to="/services" variant="outline" className="px-8 py-3 text-sm font-semibold">
            View All Categories
          </Button>
        </div>
      </div>

      <FeatureShowcase />

      <div className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Popular Options</h4>
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">Featured Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Choose from our most loved packages designed to deliver exceptional value.</p>
          </div>
          {featuredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10" data-aos="fade-up" data-aos-delay="100">
              {featuredPackages.map((pkg) => (
                <ServiceCard
                  key={pkg._id}
                  title={pkg.title}
                  subtitle={categories.find(c => c._id === pkg.categoryId)?.name || 'Package'}
                  description={pkg.description}
                  thumbnail={getImageUrl(pkg.coverImage)}
                  link={`/packages/${pkg._id}`}
                  buttonText="View Details"
                  secondaryButtonText="Gallery"
                  secondaryLink={`/gallery/${pkg.subCategoryId || pkg.serviceId}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 mb-10">
              More trending packages coming soon...
            </div>
          )}
          <div className="text-center">
            <Button to="/packages" variant="primary" className="px-8 py-3 text-sm font-semibold">
              Explore All Packages
            </Button>
          </div>
        </div>
      </div>

      <WorkspaceShowcase />
      <Reviews />
      <PromoBanner />
    </div>
  );
};

export default HomeBanner;
