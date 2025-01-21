import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
 

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the dropdown and the button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="../src/assets/logo.png" className="h-8" alt="YouLearn Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">YouLearn</span>
        </NavLink>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          

          <button
            ref={buttonRef}
            type="button"
            className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            onClick={toggleUserDropdown}
            aria-expanded={isUserDropdownOpen}
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://avatar.iran.liara.run/public"
              alt="user photo"
            />
          </button>
          <NavLink to={"/signup"}>Login</NavLink>

          {isUserDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-10 top-24 z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg shadow-slate-600 dark:bg-gray-700 dark:divide-gray-600"
            >
               
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    name@flowbite.com
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Settings
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        // Add logout logic
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
             
          )}

          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-2 px-3 ${isActive
                      ? 'text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'
                      : 'text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;