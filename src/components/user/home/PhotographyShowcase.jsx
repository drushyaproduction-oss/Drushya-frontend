import React, { useState, useEffect } from 'react';
import Button from '../../../ui/common/Button';
import { getAllCategories } from '../../../api/category';
import { getAllServices } from '../../../api/service';

const PhotographyShowcase = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const catRes = await getAllCategories();
        const categories = catRes.data || [];
        
        // Photography usually includes Weddings, Maternity, Family, Kids etc.
        const photoCategoryIds = categories
          .filter(c => c.name.toLowerCase().includes('weddings') || c.name.toLowerCase().includes('maternity') || c.name.toLowerCase().includes('family'))
          .map(c => c._id);
        
        if (photoCategoryIds.length > 0) {
          const servRes = await getAllServices();
          const services = servRes.data || [];
          const photoServices = services.filter(s => photoCategoryIds.includes(s.categoryId));
          
          let gallery = [];
          photoServices.forEach(s => {
            if (s.gallery && s.gallery.length > 0) {
              gallery.push(...s.gallery);
            }
          });
          
          if (gallery.length > 0) {
            const shuffled = gallery.sort(() => 0.5 - Math.random());
            let selected = shuffled.slice(0, 4);
            setImages(selected);
          }
        }
      } catch (error) {
        console.error("Error fetching photography images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="bg-white py-24 overflow-hidden border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col justify-center order-2 lg:order-1" data-aos="fade-right">
            <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-4 flex items-center">
              <span className="w-12 h-0.5 bg-yellow-600 mr-4"></span>
              About Our Photography
            </h4>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 mb-8 leading-tight">
              A visual showcase of your unique story
            </h2>
            <div className="space-y-6 text-gray-600 font-light text-lg mb-10 leading-relaxed">
              <p>
                We believe every photograph should evoke emotion and transport you back to the exact moment it was taken. Our showcase is a testament to the diverse range of stories we've had the privilege to document.
              </p>
              <p>
                Instead of focusing on numbers, we focus on the art. From intimate portraits to grand celebrations, we immerse ourselves in the atmosphere of your event to capture raw, authentic beauty through our lenses.
              </p>
            </div>
            
            <div>
              <Button to="/gallery/portraits" variant="primary" className="px-8 py-4 text-base shadow-lg shadow-yellow-400/30">
                Explore The Showcase
              </Button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2" data-aos="fade-left">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                  {images[0] && <img src={images[0]} alt="Wedding Showcase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>}
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                  {images[1] && <img src={images[1]} alt="Kids Showcase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>}
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                   {images[2] && <img src={images[2]} alt="Portrait Showcase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>}
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                   {images[3] && <img src={images[3]} alt="Commercial Showcase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>}
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full blur-[100px] opacity-20 z-0 pointer-events-none"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PhotographyShowcase;
