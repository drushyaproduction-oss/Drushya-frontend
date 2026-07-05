import React from 'react';
import Button from '../../../ui/common/Button';

const PromoBanner = () => {
  return (
    <div className="w-full bg-[#303030] py-16 md:py-20 mt-15">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-8 md:mb-0 relative" data-aos="fade-right">
          <h2 className="text-3xl md:text-4xl text-white font-medium tracking-wide">
            Contact Today For Special Price!
          </h2>
          <div className="w-28 h-1 bg-white mt-4"></div>
        </div>
        <div data-aos="fade-left">
          <Button to="/contact" variant="pill" className="text-sm font-semibold px-8 py-3">
            Book Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
