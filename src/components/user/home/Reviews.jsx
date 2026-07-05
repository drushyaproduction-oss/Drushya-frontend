import React from 'react';
import { FaStar } from 'react-icons/fa';

const reviewsData = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Bride",
    text: "Drushya's Production made our wedding day unforgettable! The photos are absolutely stunning, capturing every candid emotion. Highly recommend them for any event.",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Desai",
    role: "Corporate Client",
    text: "Professional, punctual, and incredibly creative. They delivered exactly what we needed for our corporate branding. The video quality is top-notch.",
    rating: 5
  },
  {
    id: 3,
    name: "Anjali Verma",
    role: "Mother",
    text: "The newborn photoshoot was handled with so much care and patience. The final pictures brought tears to my eyes. Thank you for these precious memories!",
    rating: 5
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Groom",
    text: "From pre-wedding to the reception, the team was fantastic. They made us feel so comfortable in front of the camera. The cinematic video is a masterpiece.",
    rating: 5
  },
  {
    id: 5,
    name: "Sneha Patel",
    role: "Model",
    text: "I did a portfolio shoot with The Rishi Studio. The lighting, direction, and editing were flawless. Best photography studio in Ahilyanagar!",
    rating: 5
  }
];

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 w-[350px] md:w-[450px] flex-shrink-0 mx-4 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex text-yellow-400 mb-4">
        {[...Array(review.rating)].map((_, i) => (
          <FaStar key={i} className="mr-1" />
        ))}
      </div>
      <p className="text-gray-700 italic mb-6 text-lg flex-grow font-light">"{review.text}"</p>
      <div className="mt-auto flex items-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400 mr-4">
          {review.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{review.name}</h4>
          <p className="text-sm text-yellow-600 font-medium">{review.role}</p>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  // Duplicate the array to create a seamless infinite scroll effect
  const doubledReviews = [...reviewsData, ...reviewsData, ...reviewsData];

  return (
    <section className="py-10 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center" data-aos="fade-up">
        <h4 className="text-yellow-600 font-bold uppercase tracking-widest text-sm mb-2">Testimonials</h4>
        <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">What Our Clients Say</h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full flex overflow-hidden group">
        {/* Left and Right Fade overlays for smoother transition */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 hidden md:block pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 hidden md:block pointer-events-none"></div>

        {/* Scrolling Content */}
        <div className="animate-marquee py-4 flex">
          {doubledReviews.map((review, index) => (
            <ReviewCard key={`${review.id}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
