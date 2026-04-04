import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ClipboardList, X, Bell } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

let searchTimeout;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5130';
        const res = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent(value)}&pageSize=5`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.items || []);
        }
      } catch (err) {
        if (err.name !== 'TypeError') {
          console.error("Search failed:", err);
        }
      }
    }, 300);
  };

  // Handle Notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    const userId = user?.id;
    if (!userId || userId === "undefined") return;
    const token = localStorage.getItem('token');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5130';
      const res = await fetch(`${baseUrl}/api/notifications/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      // Ignore TypeError (network error) to prevent console spam / looping when backend is down
      if (err.name !== 'TypeError') {
        console.error("Fetch notifications failed:", err);
      }
    }
  };

  const markNotifAsRead = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5130';
      await fetch(`${baseUrl}/api/notifications/${id}/read`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      if (err.name !== 'TypeError') {
        console.error("Mark notification as read failed:", err);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchTerm('');
  };

  const handleLogout = () => {
    logout();
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
          {(user?.role === 'admin' || user?.role === 'owner') ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="nav-link" style={{color: '#0ea5e9'}}>🛡️ Admin Dashboard</Link>
              ) : (
                <Link to="/owner/dashboard" className="nav-link" style={{color: '#fbbf24'}}>👑 Owner Dashboard</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/sale" className="nav-link sale-link">Sale</Link>
              <Link to="/keyboards" className="nav-link">Keyboards</Link>
              <Link to="/mice" className="nav-link">Mice</Link>
              <Link to="/headphones" className="nav-link">Headphones</Link>
              <Link to="/accessories" className="nav-link">Accessories</Link>
              <Link to="/web-driver" className="nav-link">Web Driver</Link>
              <Link to="/reviews" className="nav-link">Reviews</Link>
              <Link to="/blog" className="nav-link">Blog</Link>
            </>
          )}
        </div>

        {/* Right icons */}
        <div className="nav-icons">
          {!(user?.role === 'admin' || user?.role === 'owner') && (
            <>
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
                      onChange={handleSearch}
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
                              <img src={product.image || product.imageUrl} alt={product.name} />
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

              <div className="notif-container" ref={notifRef}>
                 <button className="icon-btn notif-btn" onClick={() => setIsNotifOpen(!isNotifOpen)} aria-label="Notifications">
                    <Bell size={22} />
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                 </button>
                 {isNotifOpen && (
                    <div className="notif-dropdown">
                       <div className="notif-header">Thông báo</div>
                       <div className="notif-list">
                          {notifications.length > 0 ? (
                            notifications.map(n => (
                              <div 
                                 key={n.id} 
                                 className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                                 onClick={() => markNotifAsRead(n.id)}
                              >
                                 <p className="notif-msg">{n.message}</p>
                                 <span className="notif-time">{new Date(n.createdAt).toLocaleString('vi-VN')}</span>
                              </div>
                            ))
                          ) : (
                            <div className="notif-empty">Không có thông báo mới.</div>
                          )}
                       </div>
                    </div>
                 )}
              </div>
            </>
          )}
          
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
                  {user?.role === 'owner' && (
                    <button
                      type="button"
                      className="user-dropdown-item user-dropdown-owner"
                      onClick={() => handleNavigateFromMenu('/owner')}
                      style={{ color: '#fbbf24', fontWeight: 'bold' }}
                    >
                      👑 Owner Dashboard
                    </button>
                  )}
                    {user?.role === 'admin' && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                          type="button"
                          className="user-dropdown-item user-dropdown-admin"
                          onClick={() => handleNavigateFromMenu('/admin')}
                        >
                          🛡️ Admin Dashboard
                        </button>
                        <button
                          type="button"
                          className="user-dropdown-item"
                          onClick={() => handleNavigateFromMenu('/admin/chat')}
                          style={{ color: '#0ea5e9', fontWeight: 'bold' }}
                        >
                          💬 Support Chat
                        </button>
                      </div>
                    )}
                  {!(user?.role === 'admin' || user?.role === 'owner') && (
                    <>
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
                    </>
                  )}
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

          {!(user?.role === 'admin' || user?.role === 'owner') && (
            <>
              <Link to="/orders" className="icon-btn" aria-label="Orders">
                <ClipboardList size={22} />
              </Link>

              <Link to="/cart" className="icon-btn cart-btn nav-link" aria-label="Cart" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <ShoppingCart size={22} />
                <span className="cart-text">CART</span>
                <span className="cart-badge">{cartCount}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
