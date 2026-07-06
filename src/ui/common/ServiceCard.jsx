import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ title, subtitle, description, thumbnail, link, buttonText, secondaryButtonText, secondaryLink, isTrending }) => {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-500 transform hover:-translate-y-2 flex flex-col group border border-gray-100 h-full" data-aos="fade-up">
      <div className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-90"></div>
        
        {isTrending && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30 flex items-center z-10 border border-red-400/50 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 mr-1.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Trending
          </div>
        )}

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
