import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
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
import Blog from './pages/Blog';
import WebDriver from './pages/WebDriver';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/keyboards" element={<Keyboards />} />
            <Route path="/mice" element={<Mice />} />
            <Route path="/mousepad" element={<Mousepad />} />
            <Route path="/headphones" element={<Headphones />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/web-driver" element={<WebDriver />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
        <Footer />
      </Router>
  </CartProvider>
  );
}

export default App;
