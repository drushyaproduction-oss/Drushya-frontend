import React, { useState } from 'react';

const faqData = [
  {
    question: "How do I book a session?",
    answer: "You can book a session by visiting our Packages page, selecting the package you want, and clicking 'Book Now'. Fill out the form, and we will get back to you within 24 hours to confirm the date and time."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We require a 50% non-refundable deposit to secure your booking. If you need to reschedule, please let us know at least 48 hours in advance, and we will do our best to accommodate you."
  },
  {
    question: "How long does it take to receive the edited photos?",
    answer: "Our standard turnaround time is 2-3 weeks for portrait sessions and 4-6 weeks for weddings. We also offer expedited delivery options for an additional fee."
  },
  {
    question: "Do you provide raw (unedited) files?",
    answer: "We do not provide unedited raw files. Our editing process is a crucial part of our artistic style, and we want to ensure every image you receive represents our highest standard of work."
  },
  {
    question: "Can I choose the location for my shoot?",
    answer: "Absolutely! We love shooting at new locations. If you have a specific place in mind, let us know. We can also provide recommendations based on the style and vibe you are going for."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop"
          alt="FAQ Background"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium text-center px-4">
            Frequently Asked Questions
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">We're here to help</h2>
          <p className="text-gray-600">Find answers to common questions about our photography services.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                className="w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-semibold text-gray-800 text-lg pr-4">{faq.question}</span>
                <span className="text-yellow-500 shrink-0">
                  {openIndex === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
