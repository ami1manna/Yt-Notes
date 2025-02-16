import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import Profile from '../ui/Profile';
import { Menu, NotebookPenIcon, X } from 'lucide-react';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'DashBoard' },
   
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md   w-full top-0 z-50">
      <div className="w-full flex items-center justify-between px-6 py-3 md:px-10">
        {/* Logo Section */}
        <NavLink to="/" className="flex items-center space-x-3">
          <NotebookPenIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <span className="hidden md:block text-2xl font-semibold dark:text-white">YouLearn</span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 text-lg font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle />
          <Profile />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700 dark:text-white focus:outline-none">
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden flex flex-col items-center bg-white dark:bg-gray-900 shadow-md py-4 space-y-4"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-lg font-medium text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <ThemeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNav;
