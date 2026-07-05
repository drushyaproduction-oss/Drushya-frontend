import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-black">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop"
          alt="Privacy Policy Background"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24">
          <h1 className="text-4xl md:text-5xl text-white tracking-wide mb-6 font-medium text-center px-4">
            Privacy Policy
          </h1>
          <div className="w-24 h-0.5 bg-yellow-400"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-gray-800 px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="space-y-8 text-base leading-relaxed text-gray-600">
          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
            <p>
              Welcome to Drushya's Photography. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. The Data We Collect About You</h2>
            <p>
              We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong className="text-gray-800">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong className="text-gray-800">Contact Data:</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
              <li><strong className="text-gray-800">Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li><strong className="text-gray-800">Usage Data:</strong> includes information about how you use our website, products, and services.</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Image Usage and Copyright</h2>
            <p>
              As a photography service, we retain the copyright to all images created during your session. We reserve the right to use these images for promotional purposes, including our portfolio, website, and social media channels. If you wish to keep your images completely private, please discuss this with us prior to booking so we can accommodate a non-disclosure agreement (NDA).
            </p>
          </section>

          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact Page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
