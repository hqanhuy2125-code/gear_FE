import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import OwnerRoute from './components/OwnerRoute';
import UserRoute from './components/UserRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sale from './pages/Sale';
import Accessories from './pages/Accessories';
import Keyboards from './pages/Keyboards';
import Mice from './pages/Mice';
import Mousepad from './pages/Mousepad';
import Headphones from './pages/Headphones';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import VnPayReturn from './pages/VnPayReturn';
import Blog from './pages/Blog';
import WebDriver from './pages/WebDriver';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import AdminChat from './pages/AdminChat';
import OwnerDashboard from './pages/OwnerDashboard';
import ProductDetail from './pages/ProductDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsOfService from './pages/TermsOfService';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import UserManual from './pages/UserManual';
import Reviews from './pages/Reviews';
import Chatbox from './components/Chatbox';
import Security from './pages/Security';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/keyboards" element={<Keyboards />} />
              <Route path="/mice" element={<Mice />} />
              <Route path="/mousepad" element={<Mousepad />} />
              <Route path="/headphones" element={<Headphones />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/web-driver" element={<WebDriver />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/security" element={<Security />} />
              <Route path="/reviews" element={<Reviews />} />
              
              {/* Informational & Policy Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/user-manual" element={<UserManual />} />
              <Route path="/where-to-buy" element={<AboutUs />} /> {/* Placeholder to same About page */}
              <Route path="/join-us" element={<AboutUs />} />      {/* Placeholder to same About page */}
              <Route path="/affiliates" element={<AboutUs />} />   {/* Placeholder to same About page */}
              <Route path="/distributor" element={<AboutUs />} />  {/* Placeholder to same About page */}

              {/* User-protected routes */}
              <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
              <Route path="/orders" element={<UserRoute><Orders /></UserRoute>} />
              <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
              <Route path="/vnpay-return" element={<UserRoute><VnPayReturn /></UserRoute>} />

              {/* Admin-protected routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><Profile /></AdminRoute>} />
              <Route path="/admin/chat" element={<AdminRoute><AdminChat /></AdminRoute>} />

              {/* Owner-protected routes */}
              <Route path="/owner" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
            </Routes>
          </div>
          <Footer />
          <Chatbox />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
