import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { NotebookPenIcon, Menu, X, Home, LayoutDashboard, Users } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import Profile from "../ui/Profile";

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/groups", label: "Groups", icon: Users },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-[999] transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          {/* Logo Section */}
          <NavLink 
            to="/" 
            className="group flex items-center space-x-3 transition-transform duration-300 hover:scale-105"
          >
            <NotebookPenIcon className="w-8 h-8 text-teal-500 dark:text-teal-400 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
              YouLearn
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 text-lg font-medium transition-all duration-300 rounded-lg hover:scale-105 ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400"
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
              <Profile />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-center bg-white dark:bg-gray-900 shadow-lg py-5 space-y-5 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 text-lg font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full justify-center">
              <ThemeToggle />
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;