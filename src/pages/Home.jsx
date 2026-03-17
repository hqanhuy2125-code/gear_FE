import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Award, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import '../styles/Home.css';

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Toast chào mừng store (hiện với mọi người)
  const [storeToast, setStoreToast] = useState(false);
  const [storeToastHiding, setStoreToastHiding] = useState(false);

  // Alert sau khi login
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Hiện store toast khi vào Home
  useEffect(() => {
    const t = setTimeout(() => setStoreToast(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Tự ẩn store toast sau 5s
  useEffect(() => {
    if (storeToast) {
      const t = setTimeout(() => {
        setStoreToastHiding(true);
        setTimeout(() => setStoreToast(false), 300);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [storeToast]);

  // Alert chào mừng sau login
  useEffect(() => {
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.name) {
            setUserName(user.name);
            setWelcomeVisible(true);
          }
        } catch (e) {}
      }
      sessionStorage.removeItem('justLoggedIn');
    }
  }, []);

  const featuredKeyboard    = products.find(p => p.category === 'keyboards');
  const featuredMouse       = products.find(p => p.category === 'mice');
  const featuredHeadphones  = products.find(p => p.category === 'headphones');
  const featuredAccessories = products.find(p => p.category === 'accessories');

  const featuredProducts = [featuredKeyboard, featuredMouse, featuredHeadphones, featuredAccessories].filter(Boolean);
  const topPicks = products.slice(0, 8);

  const highlights = [
    { icon: <Zap size={26} />,    title: '8KHz Polling', sub: 'Ultra-low 0.08ms response time' },
    { icon: <Shield size={26} />, title: 'Hall Effect',  sub: 'Magnetic switches, zero wear' },
    { icon: <Award size={26} />,  title: '26K DPI',      sub: 'Pixel-perfect optical sensor' },
  ];

  const [refFeatured,  visFeatured]  = useReveal();
  const [refCats,      visCats]      = useReveal();
  const [refPicks,     visPicks]     = useReveal();
  const [refHighlight, visHighlight] = useReveal();
  const [refStats,     visStats]     = useReveal();

  return (
    <div className="home-v2">

      {/* STORE WELCOME TOAST — góc phải */}
      {storeToast && (
        <div className={`store-welcome-toast ${storeToastHiding ? 'hiding' : ''}`}>
          <span className="toast-icon">🎮</span>
          <div className="toast-text">
            <strong>Chào mừng đến SCYTOL CLX21!</strong>
            <span>Khám phá gaming gear cao cấp — deal hot mỗi ngày.</span>
          </div>
          <button onClick={() => { setStoreToastHiding(true); setTimeout(() => setStoreToast(false), 300); }}>×</button>
        </div>
      )}

      {/* LOGIN WELCOME ALERT — banner trên cùng */}
      {welcomeVisible && (
        <div className="welcome-alert">
          <span>👋 Chào mừng trở lại, <strong>{userName}</strong>! Xem ngay deal mới nhất hôm nay.</span>
          <button onClick={() => setWelcomeVisible(false)}>×</button>
        </div>
      )}

      {/* ANNOUNCEMENT BAR */}
      {announcementVisible && (
        <div className="ann-bar">
          <div className="ann-inner">
            <span className="ann-label">Discount code:</span>
            <span className="ann-code">SCYTOL2026</span>
            <span className="ann-text">
              ⚡ Nâng cấp setup 2026! Giảm 12% tất cả bàn phím &amp; phụ kiện.
              Nhập code <strong>SCYTOL2026</strong> khi thanh toán.
            </span>
          </div>
          <button className="ann-close" onClick={() => setAnnouncementVisible(false)}>×</button>
        </div>
      )}

      {/* HERO */}
      <section className={`hero-section ${heroLoaded ? 'hero-in' : ''}`}>
        <div className="hero-bg-grid" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">NEW ARRIVAL 2026</span>
            <h1 className="hero-title">Level Up<br />Your <span className="hero-accent">Setup</span></h1>
            <p className="hero-desc">Gaming gear cao cấp dành cho những người chơi nghiêm túc. Tốc độ, độ chính xác và phong cách — tất cả trong một.</p>
            <div className="hero-actions">
              <Link to="/keyboards" className="hero-cta-primary">Shop Now <ArrowRight size={18} /></Link>
              <Link to="/sale" className="hero-cta-ghost">View Sale</Link>
            </div>
            <div className="hero-badges">
              {highlights.map((h, i) => (
                <div key={i} className="hero-badge">
                  <span className="hero-badge-icon">{h.icon}</span>
                  <div>
                    <p className="hero-badge-title">{h.title}</p>
                    <p className="hero-badge-sub">{h.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <div className="hero-ring hero-ring-1" />
              <div className="hero-ring hero-ring-2" />
              {featuredKeyboard?.image && <img src={featuredKeyboard.image} alt={featuredKeyboard.name} className="hero-product-img" />}
              <div className="hero-float-tag">
                <span className="hft-name">{featuredKeyboard?.name}</span>
                <span className="hft-price">{featuredKeyboard?.price?.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={`section-featured ${visFeatured ? 'reveal-in' : 'reveal-out'}`} ref={refFeatured}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Top Picks</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/keyboards" className="section-link">Browse all <ChevronRight size={16} /></Link>
          </div>
          <div className="featured-grid">
            {featuredProducts.map((p, i) => {
              const salePrice = p.sale ? Math.round(p.price * (1 - p.discount / 100)) : null;
              return (
                <Link key={p.id} to={`/${p.category}`} className="feat-card" style={{ '--delay': `${i * 0.08}s` }}>
                  <div className="feat-card-img">
                    {p.sale && <span className="feat-sale-badge">-{p.discount}%</span>}
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="feat-card-body">
                    <span className="feat-cat">{p.category}</span>
                    <h3 className="feat-name">{p.name}</h3>
                    <div className="feat-price-row">
                      {salePrice ? (<><span className="feat-price-old">{p.price.toLocaleString('vi-VN')} ₫</span><span className="feat-price">{salePrice.toLocaleString('vi-VN')} ₫</span></>) : (<span className="feat-price">{p.price.toLocaleString('vi-VN')} ₫</span>)}
                    </div>
                    <span className="feat-cta">Shop Now →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORY BENTO */}
      <section className={`section-categories ${visCats ? 'reveal-in' : 'reveal-out'}`} ref={refCats}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">What's you like</p>
              <h2 className="section-title">All Categories</h2>
            </div>
          </div>
          <div className="bento-grid">
            <Link to="/keyboards" className="bento-card bento-large">
              <div className="bento-bg" style={{ background: 'linear-gradient(135deg, #e8f4ff 0%, #cce8ff 100%)' }} />
              {featuredKeyboard?.image && <img src={featuredKeyboard.image} alt="Keyboards" className="bento-img" />}
              <div className="bento-label"><span className="bento-cat">Hall Effect</span><h3>Gaming Keyboards</h3><span className="bento-arrow">→</span></div>
            </Link>
            <div className="bento-col">
              <Link to="/mice" className="bento-card bento-sm">
                <div className="bento-bg" style={{ background: 'linear-gradient(135deg, #fff0e8 0%, #ffd6ba 100%)' }} />
                {featuredMouse?.image && <img src={featuredMouse.image} alt="Mice" className="bento-img" />}
                <div className="bento-label"><span className="bento-cat">Lightweight</span><h3>Gaming Mice</h3><span className="bento-arrow">→</span></div>
              </Link>
              <div className="bento-row">
                <Link to="/headphones" className="bento-card bento-xs">
                  <div className="bento-bg" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #ddbfff 100%)' }} />
                  {featuredHeadphones?.image && <img src={featuredHeadphones.image} alt="Headphones" className="bento-img" />}
                  <div className="bento-label"><span className="bento-cat">7.1 Surround</span><h3>Headsets</h3><span className="bento-arrow">→</span></div>
                </Link>
                <Link to="/accessories" className="bento-card bento-xs">
                  <div className="bento-bg" style={{ background: 'linear-gradient(135deg, #e8fff3 0%, #b6f5d4 100%)' }} />
                  {featuredAccessories?.image && <img src={featuredAccessories.image} alt="Accessories" className="bento-img" />}
                  <div className="bento-label"><span className="bento-cat">Premium</span><h3>Accessories</h3><span className="bento-arrow">→</span></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP PICKS */}
      <section className={`section-picks ${visPicks ? 'reveal-in' : 'reveal-out'}`} ref={refPicks}>
        <div className="section-inner">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Bestsellers</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/sale" className="section-link">View all <ChevronRight size={16} /></Link>
          </div>
          <div className="picks-grid">
            {topPicks.map((p, i) => {
              const salePrice = p.sale ? Math.round(p.price * (1 - p.discount / 100)) : null;
              return (
                <Link key={p.id} to={`/${p.category}`} className="pick-card" style={{ '--delay': `${i * 0.06}s` }}>
                  <div className="pick-img-wrap">
                    {p.sale && <span className="pick-sale">SALE</span>}
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="pick-info">
                    <p className="pick-name">{p.name}</p>
                    <div className="pick-prices">
                      {salePrice && <span className="pick-old">{p.price.toLocaleString('vi-VN')} ₫</span>}
                      <span className="pick-cur">{(salePrice ?? p.price).toLocaleString('vi-VN')} ₫</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HIGHLIGHT */}
      <section className={`section-highlight ${visHighlight ? 'reveal-in' : 'reveal-out'}`} ref={refHighlight}>
        <div className="section-inner highlight-inner">
          <div className="hl-img-side">
            <div className="hl-img-frame">
              <div className="hl-blob" />
              {featuredMouse?.image && <img src={featuredMouse.image} alt={featuredMouse.name} className="hl-img" />}
            </div>
          </div>
          <div className="hl-text-side">
            <span className="hl-eyebrow">Why SCYTOL</span>
            <h2 className="hl-title">Built for<br /><span className="hl-accent">Champions</span></h2>
            <p className="hl-desc">Mỗi sản phẩm được thiết kế với công nghệ tiên tiến nhất, đảm bảo hiệu suất đỉnh cao trong từng ván game. Từ switch Hall Effect đến cảm biến 26K DPI — mọi chi tiết đều được tối ưu.</p>
            <div className="hl-specs">
              {[
                { num: '8KHz',   lbl: 'Polling Rate' },
                { num: '0.08ms', lbl: 'Response Time' },
                { num: '26K',    lbl: 'DPI Sensor' },
                { num: '512K',   lbl: 'Scan Rate' },
              ].map((s, i) => (
                <div key={i} className="hl-spec">
                  <span className="hl-spec-num">{s.num}</span>
                  <span className="hl-spec-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
            <Link to="/keyboards" className="hl-cta">Explore Products <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={`stats-strip ${visStats ? 'reveal-in' : 'reveal-out'}`} ref={refStats}>
        <div className="stats-inner">
          {[
            { num: '512K',   label: 'Scan Rate' },
            { num: '0.08ms', label: 'Latency' },
            { num: '8KHz',   label: 'Polling Rate' },
            { num: '26K',    label: 'DPI Sensor' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="stat-item">
                <span className="stat-num">{s.num}</span>
                <span className="stat-lbl">{s.label}</span>
              </div>
              {i < arr.length - 1 && <div className="stat-div" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* CHAT */}
      <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-widget-header">
          <span>Hỗ trợ trực tuyến</span>
          <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>×</button>
        </div>
        <div className="chat-widget-body">
          <p className="chat-greeting">Xin chào! Chúng tôi có thể giúp gì cho bạn? 👋</p>
          <div className="chat-quick-actions">
            <button className="chat-pill">Thông tin giao hàng</button>
            <button className="chat-pill">Liên hệ hỗ trợ</button>
          </div>
        </div>
      </div>
      <button className="chat-toggle-button" onClick={() => setIsChatOpen(p => !p)}>
        <span>Chat</span>
      </button>
    </div>
  );
};

export default Home;