import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, subtitle, description, thumbnail, link, buttonText, secondaryButtonText, secondaryLink }) => {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col group border border-gray-100 h-full" data-aos="fade-up">
      <div className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-90"></div>
        <div className="absolute bottom-5 left-6 right-6">
          <h3 className="text-2xl font-bold text-white tracking-wide leading-tight line-clamp-2 drop-shadow-md">{title}</h3>
        </div>
      </div>
      <div className="py-7 px-6 flex flex-col flex-grow">
        {subtitle && (
          <h4 className="text-[11px] font-bold text-yellow-600 mb-4 uppercase tracking-widest leading-relaxed">{subtitle}</h4>
        )}
        <p className="text-gray-600 font-light text-[15px] mb-8 flex-grow leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="mt-auto flex space-x-3 w-full">
          <Link 
            to={link || "/contact"} 
            className={`inline-flex items-center justify-center text-[13px] sm:text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl px-2 py-3 transition-all duration-300 ${secondaryButtonText ? 'flex-1' : 'w-full'} shadow-md shadow-yellow-400/20 active:scale-[0.98]`}
          >
            {buttonText || "View More"}
          </Link>
          {secondaryButtonText && (
            <Link 
              to={secondaryLink || "/contact"} 
              className="inline-flex items-center justify-center text-[13px] sm:text-sm font-bold border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 rounded-xl px-2 py-3 flex-1 transition-all duration-300 active:scale-[0.98]"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
