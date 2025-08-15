import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold text-primary">FindRentalManager</span>
              <span className="text-2xl font-bold text-gray-700 transition-all group-hover:text-primary">.com</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`font-medium ${location === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              href="/submit" 
              className={`font-medium ${location === '/submit' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              List Your Management Company
            </Link>
            <Link 
              href="/partnerships" 
              className={`font-medium ${location === '/partnerships' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Partnerships
            </Link>
            <Link 
              href="/faq" 
              className={`font-medium ${location === '/faq' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              FAQ
            </Link>
            <Link 
              href="/testimonials" 
              className={`font-medium ${location === '/testimonials' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
            >
              Testimonials
            </Link>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={toggleMenu} 
              className="text-gray-600 hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/submit"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/submit' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeMenu}
              >
                List Your Management Company
              </Link>
              <Link 
                href="/partnerships"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/partnerships' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeMenu}
              >
                Partnerships
              </Link>
              <Link 
                href="/faq"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/faq' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link 
                href="/testimonials"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/testimonials' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={closeMenu}
              >
                Testimonials
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
