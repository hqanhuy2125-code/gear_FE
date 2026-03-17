import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, LogOut, X } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import { products } from '../data/products';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const { cartCount } = useContext(CartContext);

  const loadUserFromStorage = () => {
    const stored =
      localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(loadUserFromStorage);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const handleUserLogin = () => {
      setUser(loadUserFromStorage());
    };
    window.addEventListener('userLogin', handleUserLogin);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  // Handle outside click to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle real-time search logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results.slice(0, 5)); // Limit to 5 results
  }, [searchTerm]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchTerm('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const getDisplayName = () => {
    if (!user) return '';
    if (user.name && user.name.trim() && user.name !== 'Guest User') {
      return user.name;
    }
    if (user.email) {
      const base = user.email.split('@')[0];
      return base || user.email;
    }
    return '';
  };

  const displayName = getDisplayName();
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  const handleNavigateFromMenu = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          SCYTOL <span className="logo-highlight">CLX21</span>
        </Link>

        {/* Center menu */}
        <div className="nav-menu">
          <Link to="/sale" className="nav-link sale-link">Sale</Link>
          <Link to="/keyboards" className="nav-link">Keyboards</Link>
          <Link to="/mice" className="nav-link">Mice</Link>
          <Link to="/headphones" className="nav-link">Headphones</Link>
          <Link to="/accessories" className="nav-link">Accessories</Link>
          <Link to="/web-driver" className="nav-link">Web Driver</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
        </div>

        {/* Right icons */}
        <div className="nav-icons">
          <div className="search-container" ref={searchRef}>
            <button className="icon-btn" onClick={toggleSearch} aria-label="Search">
              {isSearchOpen ? <X size={22} /> : <Search size={22} />}
            </button>
            
            {isSearchOpen && (
              <div className="search-dropdown">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                
                {searchTerm && (
                  <div className="search-results">
                    {searchResults.length > 0 ? (
                      searchResults.map(product => (
                        <Link 
                          to="/" 
                          key={product.id} 
                          className="search-item"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <img src={product.image} alt={product.name} />
                          <div className="search-item-info">
                            <h4>{product.name}</h4>
                            <span>{product.price.toLocaleString('vi-VN')} ₫</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="search-no-results">Không tìm thấy sản phẩm.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                type="button"
                className="user-menu-trigger"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <div className="user-avatar-circle">{userInitial}</div>
                <span className="user-greeting">
                  {displayName ? `Hi, ${displayName}` : 'My Account'}
                </span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => handleNavigateFromMenu('/profile')}
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => handleNavigateFromMenu('/orders')}
                  >
                    My Orders
                  </button>
                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => handleNavigateFromMenu('/wishlist')}
                  >
                    Wishlist
                  </button>
                  <button
                    type="button"
                    className="user-dropdown-item user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Login / Sign Up
            </Link>
          )}

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingCart size={22} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
