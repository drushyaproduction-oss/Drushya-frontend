import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaInstagram, FaEnvelope, FaTelegramPlane } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 px-6 md:px-10 border-t border-gray-200 shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="flex flex-col items-start justify-start">
          <div className="font-bold text-2xl tracking-widest leading-none flex items-center uppercase text-black">
            DRUSHYA
          </div>
          <span className="text-black text-[0.6rem] tracking-[0.3em] font-light mt-1 ml-1 uppercase">PRODUCTIONS</span>
          <p className="mt-5 text-gray-600 text-sm leading-relaxed max-w-sm">
            Capturing your most precious moments. Let us tell your story through our lens with passion and creativity.
          </p>
          <div className="flex space-x-4 mt-8">
            <a href="https://www.instagram.com/rushikesh_lokhande0401/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-pink-600 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white shadow-sm transition-all duration-300 transform hover:-translate-y-1">
              <FaInstagram className="text-lg" />
            </a>
            <a href="mailto:rushikeshl1998@gmail.com" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-sm transition-all duration-300 transform hover:-translate-y-1">
              <FaEnvelope className="text-lg" />
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white shadow-sm transition-all duration-300 transform hover:-translate-y-1">
              <FaTelegramPlane className="text-lg" />
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-5 uppercase tracking-widest text-black">Quick Links</h3>
          <div className="flex flex-col space-y-3">
            <Link to="/privacy-policy" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors font-medium">Privacy Policy</Link>
            <Link to="/faq" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors font-medium">FAQ</Link>
            <Link to="/contact" className="text-sm text-gray-700 hover:text-yellow-600 transition-colors font-medium">Contact</Link>
          </div>
        </div>
        {/* Locations Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-5 uppercase tracking-widest text-black">Studio Locations</h3>
          <div className="flex flex-col space-y-5">
            <a 
              href="https://maps.app.goo.gl/auy9TwgFgL5ZXvL5A" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start group transition-colors"
            >
              <FaMapMarkerAlt className="mt-1 mr-3 text-red-500 shrink-0 text-xl group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                <strong className="block text-base font-semibold text-gray-900 mb-1">Drushya Productions</strong>
                Baner, Pune
              </span>
            </a>
            
            <a 
              href="https://maps.app.goo.gl/bcCMyUS5wVj1hTk67" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start group transition-colors"
            >
              <FaMapMarkerAlt className="mt-1 mr-3 text-red-500 shrink-0 text-xl group-hover:scale-110 transition-transform" />
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors">
                <strong className="block text-base font-semibold text-gray-900 mb-1">The Rishi Studio</strong>
                Savedi, Ahilyanagar
              </span>
            </a>
          </div>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold mb-5 uppercase tracking-widest text-black">Contact Us</h3>
          <div className="flex flex-col space-y-4">
            <a href="tel:+919158212338" className="flex items-center space-x-3 text-gray-700 hover:text-black transition-colors group">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                <FaPhoneAlt className="text-blue-600 text-sm" />
              </div>
              <span className="text-base font-medium">9158212338</span>
            </a>
          </div>
        </div>

      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 font-light">
        &copy; {new Date().getFullYear()} Drushya's Production. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
