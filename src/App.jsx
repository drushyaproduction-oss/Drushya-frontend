import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './ui/layout/Navbar';
import Footer from './ui/layout/Footer';
import HomeBanner from './components/user/home/Home-banner';
import UserContact from './components/user/contact/Contact';
import About from './components/user/about/About';
import Services from './components/user/services/Services';
import CategoryDetails from './components/user/services/CategoryDetails';
import Packages from './components/user/packages/Packages';
import PackageDetails from './components/user/packages/PackageDetails';
import Gallery from './components/user/gallery/Gallery';
import Faq from './ui/static/Faq';
import PrivacyPolicy from './ui/static/Privacy-policy';
import WhatsAppButton from './ui/common/WhatsAppButton';
import Login from './(auth)/Login';
import AdminDashboard from './components/admin/dashboard/AdminDashboard';
import Category from './components/admin/dashboard-category/category';
import Service from './components/admin/dashboard-service/Service';
import Package from './components/admin/dashboard-package/Package';
import Bookings from './components/admin/dashboard-booking/Bookings';
import Contact from './components/admin/dashboard-contact/contact';
import Reviews from './components/admin/dashboard-review/Reviews';
import BannerHome from './components/admin/dashboard-banner/BannerHome';
import BannerWorkspace from './components/admin/dashboard-banner/BannerWorkspace';
import BannerAbout from './components/admin/dashboard-banner/BannerAbout';
import BannerContact from './components/admin/dashboard-banner/BannerContact';
import AboutManager from './components/admin/dashboard-about/AboutManager';
import Workspace from './components/user/workspace/Workspace';
import WorkspaceAdmin from './components/admin/dashboard-workspace/WorkspaceAdmin';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideLayout = isAuthRoute || isAdminRoute;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50,
    });
  }, []);

  return (
    <div className="relative min-h-screen font-sans">
      {!hideLayout && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<HomeBanner />} />
          <Route path="/contact" element={<UserContact />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<CategoryDetails />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/packages/service/:serviceId" element={<PackageDetails />} />
          <Route path="/gallery/:id" element={<Gallery />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* Auth & Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/home" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<Service />} />
          <Route path="/admin/services/trending" element={<Service isTrendingPage={true} />} />
          <Route path="/admin/packages" element={<Package />} />
          <Route path="/admin/packages/trending" element={<Package isTrendingPage={true} />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/contact" element={<Contact />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/banner/home" element={<BannerHome />} />
          <Route path="/admin/banner/workspace" element={<BannerWorkspace />} />
          <Route path="/admin/banner/about" element={<BannerAbout />} />
          <Route path="/admin/banner/contact" element={<BannerContact />} />
          <Route path="/admin/about-info" element={<AboutManager />} />
          <Route path="/admin/banner/service" element={<AdminDashboard />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/workspace" element={<WorkspaceAdmin />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideLayout && <WhatsAppButton />}
      {!hideLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#333333',
            padding: '16px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #eaeaea',
            fontWeight: '500',
            fontSize: '15px'
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <AppContent />
    </Router>
  );
}

export default App;