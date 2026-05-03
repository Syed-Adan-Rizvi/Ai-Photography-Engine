import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBoxOpen, FaPenNib, FaImage, FaCamera, FaShapes, FaSwatchbook, FaIdCard, FaBars } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => setShowDrawer(false);

  const menuItems = [
    { path: "/", name: "Package Design", icon: <FaBoxOpen /> },
    { path: "/logo-design", name: "Logo Design", icon: <FaPenNib /> },
    { path: "/edit-image", name: "Edit Image", icon: <FaImage /> },
    { path: "/ai-photoshoot", name: "AI Photoshoot", icon: <FaCamera /> },
    { path: "/package-range", name: "Package Range", icon: <FaShapes /> },
    { path: "/brand-moodboard", name: "Brand Moodboard", icon: <FaSwatchbook /> },
    { path: "/business-cards", name: "Business Materials", icon: <FaIdCard /> },
  ];

  return (
    <>
      <nav className="navbar bg-white mb-4 pt-3 pb-2 shadow-sm">
        <div className="container d-block">
          
          {/* --- ROW 1: HEADER & MOBILE TOGGLE --- */}
          {/* position-relative use kiya taaki Title center rahy aur Button right side fix ho jaye */}
          <div className="d-flex justify-content-center align-items-center mb-2 position-relative">
            
            {/* Brand Title (Center) */}
            <h1 className="brand-title">SparkGen Ai</h1>

            {/* Mobile Toggler (Absolute Right) - Ab ye Right side (end-0) par hai */}
            <button className="mobile-toggler position-absolute end-0 me-2" onClick={openDrawer}>
                <FaBars />
            </button>
            
          </div>

          {/* --- ROW 2: DESKTOP MENU (Hidden on Mobile) --- */}
          <div className="desktop-menu-container mt-3">
            {menuItems.map((item, index) => (
              <NavLink key={index} to={item.path} className="nav-card p-2">
                <div>{item.icon} {item.name}</div>
              </NavLink>
            ))}
          </div>

        </div>
      </nav>

      {/* --- MOBILE OFFCANVAS (Right Side Drawer) --- */}
      <div className={`offcanvas offcanvas-end custom-offcanvas ${showDrawer ? 'show' : ''}`} style={{ visibility: showDrawer ? 'visible' : 'hidden' }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-bold">Menu</h5>
          <button type="button" className="btn-close btn-close-white" onClick={closeDrawer}></button>
        </div>
        <div className="offcanvas-body">
          {menuItems.map((item, index) => (
            <NavLink key={index} to={item.path} className="drawer-link" onClick={closeDrawer}>
              {item.icon} {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {showDrawer && <div className="offcanvas-backdrop fade show" onClick={closeDrawer}></div>}
    </>
  );
};

export default Navbar;