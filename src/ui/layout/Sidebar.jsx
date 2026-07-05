import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({ Banner: false });

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/admin', icon: <i className="pi pi-th-large text-lg"></i> },
    {
      name: 'Banner',
      icon: <i className="pi pi-image text-lg"></i>,
      subItems: [
        { name: 'Home Page Banner', path: '/admin/banner/home' },
        { name: 'Workspace Banner', path: '/admin/banner/workspace' },
        { name: 'About Page Banner', path: '/admin/banner/about' },
        { name: 'Contact Page Banner', path: '/admin/banner/contact' },
      ]
    },
    { name: 'Category', path: '/admin/category', icon: <i className="pi pi-tags text-lg"></i> },
    { name: 'About Profile Info', path: '/admin/about-info', icon: <i className="pi pi-user text-lg"></i> },
    {
      name: 'Services',
      icon: <i className="pi pi-briefcase text-lg"></i>,
      subItems: [
        { name: 'Service List', path: '/admin/services' },
        { name: 'Trending Services', path: '/admin/services/trending' },
      ]
    },
    {
      name: 'Packages',
      icon: <i className="pi pi-box text-lg"></i>,
      subItems: [
        { name: 'Package List', path: '/admin/packages' },
        { name: 'Trending Packages', path: '/admin/packages/trending' },
        { name: 'Bookings', path: '/admin/bookings' },
        { name: 'Reviews', path: '/admin/reviews' },
      ]
    },
    { name: 'Workspace', path: '/admin/workspace', icon: <i className="pi pi-building text-lg"></i> },
    { name: 'Contact', path: '/admin/contact', icon: <i className="pi pi-envelope text-lg"></i> },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 w-72 bg-[#1A1A1A] text-white flex flex-col border-r border-gray-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

      {/* Brand Header */}
      <div className="h-20 flex justify-between lg:justify-center items-center border-b border-gray-800/50 px-6 lg:px-0">
        <div className="text-center lg:w-full">
          <h2 className="text-2xl font-bold text-white mb-0.5 leading-none">
            Drushya's
          </h2>
          <div className="text-yellow-400 text-[0.65rem] font-bold tracking-[0.3em] uppercase">
            Admin Panel
          </div>
        </div>
        {setIsOpen && (
          <button className="lg:hidden text-gray-400 hover:text-white focus:outline-none" onClick={() => setIsOpen(false)}>
            <i className="pi pi-times text-xl"></i>
          </button>
        )}
      </div>

      <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto">

        {mainNavItems.map((item) => {
          if (item.subItems) {
            const isSubItemActive = item.subItems.some(sub => location.pathname === sub.path);
            const isOpen = openMenus[item.name] || isSubItemActive;

            return (
              <div key={item.name} className="flex flex-col space-y-1">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${isSubItemActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={isSubItemActive ? "text-yellow-400" : "text-gray-400"}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <i className={`pi pi-chevron-down text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>

                {isOpen && (
                  <div className="flex flex-col pl-11 pr-2 space-y-1 mt-1">
                    {item.subItems.map((sub) => {
                      const isActive = location.pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          className={`block px-4 py-2 rounded-lg transition-all duration-300 font-medium text-xs ${isActive
                              ? 'bg-yellow-400 text-gray-900 shadow-md shadow-yellow-400/10'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm ${isActive
                ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              <div className={isActive ? "text-gray-900" : "text-gray-400"}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}


      </nav>

    </div>
  );
};

export default Sidebar;
