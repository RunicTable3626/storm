import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div ref={menuRef}>
      {/* Mobile Navigation */}
      <div className="block md:hidden">
        <nav
          className="rounded-3xl z-50"
          style={{
            position: 'fixed',
            top: '0.75rem',
            left: '0.75rem',
            width: 'max-content',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, .9)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {/* Hamburger Menu Button */}
          <div className="flex items-center p-3" onClick={toggleMenu}>
            <button 
              onClick={toggleMenu} 
              className="text-gray-900 cursor-pointer focus:outline-none flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col gap-1.5 items-center justify-center">
                <span className={`block h-0.5 w-full bg-gray-900 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-gray-900 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-full bg-gray-900 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          <div 
            className={`absolute left-0 mt-4 top-full mt-0 w-48 bg-white rounded-xl shadow-lg py-2 px-3 transform origin-top-left transition-all duration-300 ${isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
            style={{ minWidth: '200px' }}
          >
            <div 
              onClick={() => handleNavigation('/action-dashboard')} 
              className={`block text-left text-xl font-semibold cursor-pointer py-2 transition duration-200 ${
                location.pathname === '/action-dashboard' ? 'text-violet-500' : 'hover:text-violet-500'
              }`}
            >
              Take action
            </div>
            <div 
              onClick={() => handleNavigation('/')} 
              className={`block text-left text-xl font-semibold cursor-pointer py-2 transition duration-200 ${
                location.pathname === '/' ? 'text-violet-500' : 'hover:text-violet-500'
              }`}
            >
              Home
            </div>
            <SignedIn>
              <div 
                onClick={() => handleNavigation('/create-action')} 
                className={`block text-left text-xl font-semibold cursor-pointer py-2 transition duration-200 ${
                  location.pathname === '/create-action' ? 'text-violet-500' : 'hover:text-violet-500'
                }`}
              >
                Create action
              </div>
              <div 
                onClick={() => handleNavigation('/admin-dashboard')} 
                className={`block text-left text-xl font-semibold cursor-pointer py-2 transition duration-200 ${
                  location.pathname === '/admin-dashboard' ? 'text-violet-500' : 'hover:text-violet-500'
                }`}
              >
                Admin dashboard
              </div>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <div 
                  className={`block text-left text-xl font-semibold cursor-pointer py-2 transition duration-200 ${
                    location.pathname === '/create-action' ? 'text-violet-500' : 'hover:text-violet-500'
                  }`}
                >
                  <button>Organizer Login</button>
                </div>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <div className="block text-left text-xl font-semibold cursor-pointer py-2 transition duration-200 hover:text-red-500 mt-2">
                  Sign Out
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
        </nav>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav
          className="rounded-3xl border-2 border-gray-200 z-50"
          style={{
            position: 'fixed',
            top: '1.15rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'max-content',
            textAlign: 'center',
            padding: '.75rem 3.25rem',
            backgroundColor: 'rgba(255, 255, 255, .9)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex space-x-6">
            <span 
              onClick={() => navigate('/action-dashboard')} 
              className={`text-xl font-semibold cursor-pointer duration-200 mt-1 ease border-b-2 ${
                location.pathname === '/action-dashboard' ? 'border-violet-500 text-violet-500' : 'border-transparent hover:text-violet-500'
              }`}
            >
              Take action
            </span>
            <span 
              onClick={() => navigate('/')} 
              className={`text-xl font-semibold cursor-pointer duration-200 ease border-b-2 mt-1 ${
                location.pathname === '/' ? 'border-violet-500 text-violet-500' : 'border-transparent hover:text-violet-500'
              }`}
            >
              Home
            </span>
            <SignedIn>
              <span 
                onClick={() => navigate('/create-action')} 
                className={`text-xl font-semibold cursor-pointer duration-200 ease mt-1 border-b-2 ${
                  location.pathname === '/create-action' ? 'border-violet-500 text-violet-500' : 'border-transparent hover:text-violet-500'
                }`}
              >
                Create action
              </span>
              <span 
                onClick={() => navigate('/admin-dashboard')} 
                className={`text-xl font-semibold cursor-pointer duration-200 ease mt-1 border-b-2 ${
                  location.pathname === '/admin-dashboard' ? 'border-violet-500 text-violet-500' : 'border-transparent hover:text-violet-500'
                }`}
              >
                Admin dashboard
              </span>
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <span 
                  onClick={() => navigate('/create-action')} 
                  className={`text-xl font-semibold cursor-pointer duration-200 ease mt-1 border-b-2 ${
                    location.pathname === '/create-action' ? 'border-violet-500 text-violet-500' : 'border-transparent hover:text-violet-500'
                  }`}
                >
                  Organizer login
                </span>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <SignOutButton>
                <span className="text-xl font-semibold cursor-pointer duration-200 ease mt-1 border-b-2 border-transparent hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="inline-block -mt-1 mr-1 size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Sign Out
                </span>
              </SignOutButton>
            </SignedIn>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
