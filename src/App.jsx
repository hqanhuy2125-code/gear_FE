import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import OwnerRoute from './components/OwnerRoute';
import UserRoute from './components/UserRoute';
import GuestOrCustomerRoute from './components/GuestOrCustomerRoute';
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
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminChat from './pages/AdminChat';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerVouchers from './pages/OwnerVouchers';
import OwnerFlashSales from './pages/OwnerFlashSales';
import OwnerSystemConfig from './pages/OwnerSystemConfig';
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
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<GuestOrCustomerRoute><Home /></GuestOrCustomerRoute>} />
              <Route path="/sale" element={<GuestOrCustomerRoute><Sale /></GuestOrCustomerRoute>} />
              <Route path="/accessories" element={<GuestOrCustomerRoute><Accessories /></GuestOrCustomerRoute>} />
              <Route path="/keyboards" element={<GuestOrCustomerRoute><Keyboards /></GuestOrCustomerRoute>} />
              <Route path="/mice" element={<GuestOrCustomerRoute><Mice /></GuestOrCustomerRoute>} />
              <Route path="/mousepad" element={<GuestOrCustomerRoute><Mousepad /></GuestOrCustomerRoute>} />
              <Route path="/headphones" element={<GuestOrCustomerRoute><Headphones /></GuestOrCustomerRoute>} />
              <Route path="/cart" element={<GuestOrCustomerRoute><Cart /></GuestOrCustomerRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/blog" element={<GuestOrCustomerRoute><Blog /></GuestOrCustomerRoute>} />
              <Route path="/web-driver" element={<GuestOrCustomerRoute><WebDriver /></GuestOrCustomerRoute>} />
              <Route path="/wishlist" element={<GuestOrCustomerRoute><Wishlist /></GuestOrCustomerRoute>} />
              <Route path="/product/:id" element={<GuestOrCustomerRoute><ProductDetail /></GuestOrCustomerRoute>} />
              <Route path="/security" element={<GuestOrCustomerRoute><Security /></GuestOrCustomerRoute>} />
              <Route path="/reviews" element={<GuestOrCustomerRoute><Reviews /></GuestOrCustomerRoute>} />

              {/* Policy Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/user-manual" element={<UserManual />} />
              <Route path="/where-to-buy" element={<AboutUs />} />
              <Route path="/join-us" element={<AboutUs />} />
              <Route path="/affiliates" element={<AboutUs />} />
              <Route path="/distributor" element={<AboutUs />} />

              {/* ===== CUSTOMER-ONLY ROUTES ===== */}
              <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
              <Route path="/orders" element={<UserRoute><Orders /></UserRoute>} />
              <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
              <Route path="/vnpay-return" element={<UserRoute><VnPayReturn /></UserRoute>} />

              {/* ===== ADMIN-ONLY ROUTES ===== */}
              {/* Legacy redirect: /admin → /admin/dashboard */}
              <Route path="/admin" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/chat" element={<AdminRoute><AdminChat /></AdminRoute>} />

              {/* ===== OWNER-ONLY ROUTES ===== */}
              {/* Legacy redirect: /owner → /owner/dashboard */}
              <Route path="/owner" element={<OwnerRoute><Navigate to="/owner/dashboard" replace /></OwnerRoute>} />
              <Route path="/owner/dashboard" element={<OwnerRoute><OwnerDashboard /></OwnerRoute>} />
              <Route path="/owner/vouchers" element={<OwnerRoute><OwnerVouchers /></OwnerRoute>} />
              <Route path="/owner/flash-sales" element={<OwnerRoute><OwnerFlashSales /></OwnerRoute>} />
              <Route path="/owner/system-config" element={<OwnerRoute><OwnerSystemConfig /></OwnerRoute>} />

              {/* Catch-all: 404 → Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <Chatbox />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
