import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Award, ChevronRight, Keyboard, Mouse, Headphones, Package } from 'lucide-react';
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
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Home = () => {
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const [storeToast, setStoreToast] = useState(false);
  const [storeToastHiding, setStoreToastHiding] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setStoreToast(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (storeToast) {
      const t = setTimeout(() => {
        setStoreToastHiding(true);
        setTimeout(() => setStoreToast(false), 300);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [storeToast]);

  useEffect(() => {
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.name) { setUserName(user.name); setWelcomeVisible(true); }
        } catch (e) {}
      }
      sessionStorage.removeItem('justLoggedIn');
    }
  }, []);

  const featuredKeyboard    = products.find(p => p.category === 'keyboards');
  const featuredMouse       = products.find(p => p.category === 'mice');
  const featuredHeadphones  = products.find(p => p.category === 'headphones');
  const featuredAccessories = products.find(p => p.category === 'accessories');
  const topPicks = products.slice(0, 8);

  const highlights = [
    { icon: <Zap size={26} />,    title: '8KHz Polling', sub: 'Ultra-low 0.08ms response time' },
    { icon: <Shield size={26} />, title: 'Hall Effect',  sub: 'Magnetic switches, zero wear' },
    { icon: <Award size={26} />,  title: '26K DPI',      sub: 'Pixel-perfect optical sensor' },
  ];

  const [refStats,     visStats]     = useReveal();
  const [refCats,      visCats]      = useReveal();
  const [refPicks,     visPicks]     = useReveal();
  const [refSysCaps,   visSysCaps]   = useReveal();
  const [refExecProt,  visExecProt]  = useReveal();
  const [refOptRes,    visOptRes]    = useReveal();
  const [refAccess,    visAccess]    = useReveal();
  const [refFeedback,  visFeedback]  = useReveal();
  const [refFaq,       visFaq]       = useReveal();
  const [refHighlight, visHighlight] = useReveal();

  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { icon: <Keyboard size={36} strokeWidth={1.5} />, label: 'Bàn phím cơ', sub: 'Hall Effect & Magnetic', to: '/keyboards', color: '#00ff88' },
    { icon: <Mouse size={36} strokeWidth={1.5} />,    label: 'Chuột gaming', sub: 'Lightweight & Precise',  to: '/mice',      color: '#00d4ff' },
    { icon: <Headphones size={36} strokeWidth={1.5} />, label: 'Tai nghe',   sub: '7.1 Surround Sound',    to: '/headphones', color: '#ff00ff' },
    { icon: <Package size={36} strokeWidth={1.5} />,  label: 'Phụ kiện',    sub: 'Mousepads & More',        to: '/accessories', color: '#ffcc00' },
  ];

  return (
    <div className="home-v2 home-cyberpunk">

      {/* STORE WELCOME TOAST */}
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

      {/* LOGIN WELCOME ALERT */}
      {welcomeVisible && (
        <div className="welcome-alert">
          <span>👋 Chào mừng trở lại, <strong>{userName}</strong>! Xem ngay deal mới nhất hôm nay.</span>
          <button onClick={() => setWelcomeVisible(false)}>×</button>
        </div>
      )}

      {/* PROMO BANNER */}
      <div className="tier-promo-banner">
        <div className="tp-content">
          <span className="tp-emoji">🔥</span>
          <div className="tp-text">
            <strong>ƯU ĐÃI KHỦNG:</strong> Mua từ <strong>5.000.000₫</strong> giảm ngay <strong>20%</strong> (tối đa 2.000.000₫)
          </div>
          <Link to="/sale" className="tp-btn">Mua ngay</Link>
        </div>
      </div>

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

      {/* ━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━ */}
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

      {/* ━━━━━━━━━━━━━━━━ SECTION 1 — STATS HUD ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-stats-hud ${visStats ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refStats}>
        <div className="cy-circuit-bg" />
        <div className="cy-scanline" />
        <div className="cy-stats-inner">
          {[
            { num: '200+',   label: 'SẢN PHẨM',   sub: 'Models Available' },
            { num: '50+',    label: 'THƯƠNG HIỆU', sub: 'Top Brands' },
            { num: '0.08ms', label: 'ĐỘ TRỄ',     sub: 'Response Time' },
            { num: '26K',    label: 'DPI',          sub: 'Optical Sensor' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="cy-stat-item">
                <span className="cy-stat-num">{s.num}</span>
                <span className="cy-stat-label">{s.label}</span>
                <span className="cy-stat-sub">{s.sub}</span>
              </div>
              {i < arr.length - 1 && <div className="cy-stat-divider" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION 2 — DANH MỤC ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-categories ${visCats ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refCats}>
        <div className="cy-section-inner">
          <div className="cy-section-header">
            <span className="cy-terminal-prompt">{'>'} DANH_MỤC.EXE</span>
            <div className="cy-header-line" />
          </div>
          <div className="cy-cat-grid">
            {categories.map((cat, i) => (
              <Link key={i} to={cat.to} className="cy-cat-card" style={{ '--cat-color': cat.color, '--delay': `${i * 0.1}s` }}>
                <div className="cy-cat-corner cy-cat-corner-tl" />
                <div className="cy-cat-corner cy-cat-corner-br" />
                <div className="cy-cat-glow" />
                <div className="cy-cat-icon" style={{ color: cat.color }}>{cat.icon}</div>
                <h3 className="cy-cat-label">{cat.label}</h3>
                <span className="cy-cat-sub">{cat.sub}</span>
                <span className="cy-cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION 3 — BESTSELLERS ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-bestsellers ${visPicks ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refPicks}>
        <div className="cy-section-inner">
          <div className="cy-section-header">
            <div className="cy-bs-title-wrap">
              <h2 className="cy-glitch-title" data-text="BESTSELLERS">BESTSELLERS</h2>
              <span className="cy-hot-badge">HOT</span>
            </div>
            <Link to="/sale" className="cy-view-all">Xem tất cả <ChevronRight size={16} /></Link>
          </div>
          <div className="cy-products-grid">
            {topPicks.map((p, i) => {
              const salePrice = p.sale ? Math.round(p.price * (1 - p.discount / 100)) : null;
              return (
                <Link key={p.id} to={`/${p.category}`} className="cy-product-card" style={{ '--delay': `${i * 0.06}s` }}>
                  <div className="cy-card-corner cy-card-corner-tl" />
                  <div className="cy-card-corner cy-card-corner-br" />
                  {p.sale && <span className="cy-sale-badge">-{p.discount}%</span>}
                  <div className="cy-card-img-wrap">
                    <img src={p.image} alt={p.name} className="cy-card-img" />
                  </div>
                  <div className="cy-card-info">
                    <span className="cy-card-cat">{p.category}</span>
                    <p className="cy-card-name">{p.name}</p>
                    <div className="cy-card-prices">
                      {salePrice && <span className="cy-price-old">{p.price.toLocaleString('vi-VN')} ₫</span>}
                      <span className="cy-price-cur">{(salePrice ?? p.price).toLocaleString('vi-VN')} ₫</span>
                    </div>
                    <span className="cy-card-cta">Shop Now →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION A — SYS_CAPABILITIES ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-sys-capabilities ${visSysCaps ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refSysCaps}>
        <div className="cy-section-inner">
          <div className="cy-section-header">
            <div>
              <span className="cy-terminal-prompt">{">>"} MODULE_REGISTRY</span>
              <h2 className="cy-glitch-title" data-text="SYS_CAPABILITIES">SYS_CAPABILITIES</h2>
            </div>
            <div className="cy-header-line" />
          </div>
          <div className="cy-grid-6">
            {[
              { icon: <Keyboard size={24} />, title: "Bàn phím cơ", desc: "Sử dụng switch Hall Effect và Magnetic cao cấp." },
              { icon: <Mouse size={24} />, title: "Chuột gaming", desc: "Siêu nhẹ, cảm biến 26K DPI chính xác." },
              { icon: <Headphones size={24} />, title: "Tai nghe", desc: "Âm thanh vòm 7.1 chân thực, không trễ." },
              { icon: <Zap size={24} />, title: "Tốc độ cao", desc: "Polling rate lên tới 8KHz, phản hồi 0.08ms." },
              { icon: <Shield size={24} />, title: "Bảo hành chính hãng", desc: "Cam kết hỗ trợ tối đa 24 tháng." },
              { icon: <Package size={24} />, title: "Phụ kiện", desc: "Lót chuột, keycap, switch lẻ đa dạng." },
            ].map((item, i) => (
              <div key={i} className={`cy-cap-card ${i === 2 ? 'active' : ''}`} style={{ '--delay': `${i * 0.12}s` }}>
                <div className="cy-cap-icon">{item.icon}</div>
                <h4 className="cy-cap-name">{item.title}</h4>
                <p className="cy-cap-desc">{item.desc}</p>
                <div className="cy-cap-corner-tl" />
                <div className="cy-cap-corner-br" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION B — EXECUTION_PROTOCOL ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-execution-protocol ${visExecProt ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refExecProt}>
        <div className="cy-section-inner cy-timeline-container">
          <div className="cy-timeline-header">
            <span className="cy-terminal-prompt">PROCEDURE_LOG</span>
            <h2 className="cy-glitch-title" data-text="EXECUTION_PROTOCOL">EXECUTION_PROTOCOL</h2>
          </div>
          <div className="cy-timeline-inner">
            <div className={`cy-timeline-path ${visExecProt ? 'animate' : ''}`} />
            <div className="cy-timeline-steps">
               {[
                 { step: "STEP_01", title: "Kết nối dữ liệu", desc: "Tích hợp công nghệ AI vào workflow của bạn chỉ với một chạm." },
                 { step: "STEP_02", title: "Cấu hình quy trình", desc: "Sử dụng bộ công cụ kéo thả để tối ưu hóa hiệu suất làm việc." },
                 { step: "STEP_03", title: "Bắt đầu trải nghiệm", desc: "Nâng tầm trò chơi với độ chính xác và tốc độ tuyệt đối." },
               ].map((s, i) => (
                 <div key={i} className="cy-timeline-step" style={{ '--delay': `${i * 0.3}s` }}>
                    <div className="cy-step-point">
                      <div className="cy-diamond-outer" />
                      <div className="cy-diamond-inner" />
                    </div>
                    <div className="cy-step-text">
                       <span className="cy-step-num">{s.step}</span>
                       <h3 className="cy-step-name">{s.title}</h3>
                       <p className="cy-step-desc">{s.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION C — OPTIMIZATION_RESULTS ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-optimization-results ${visOptRes ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refOptRes}>
        <div className="cy-section-inner cy-results-inner">
          <div className="cy-results-text">
            <h2 className="cy-glitch-title" data-text="OPTIMIZATION_RESULTS">OPTIMIZATION_RESULTS</h2>
            <div className="cy-results-checklist">
               {[
                 "Giao hàng toàn quốc",
                 "Bảo hành chính hãng",
                 "Đổi trả 7 ngày",
                 "Hỗ trợ 24/7"
               ].map((item, i) => (
                 <div key={i} className="cy-results-check-item" style={{ '--delay': `${i * 0.15}s` }}>
                    <div className="cy-check-box">✓</div>
                    <span className="cy-check-label">{item}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="cy-results-terminal">
            <div className="cy-terminal-top">
               <div className="cy-term-dots"><span/><span/><span/></div>
               <span className="cy-term-title">config.sys</span>
            </div>
            <div className="cy-terminal-body">
              <pre className="cy-typewriter-text">
{`01 import { Efficiency } from '@scytol/core';
02 
03 class SetupOptimization {
04   constructor() {
05     super();
06     this.performance = Infinity;
07     this.latency = 0.08;
08   }
09 
10   deploy() {
11     // Auto-styling enabled
12     return true;
13   }
14 }
15 `}
                <span className="cy-term-cursor">█</span>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION D — ACCESS_PASSES ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-access-passes ${visAccess ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refAccess}>
        <div className="cy-section-inner">
          <div className="cy-section-header">
            <div style={{ textAlign: 'center', width: '100%', marginBottom: '40px' }}>
              <span className="cy-terminal-prompt">CLEARANCE_LEVEL</span>
              <h2 className="cy-glitch-title" data-text="ACCESS_PASSES" style={{ margin: '10px 0' }}>ACCESS_PASSES</h2>
              <p style={{ color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>Select your clearance level.</p>
            </div>
          </div>
          <div className="cy-passes-grid">
            {[
              { level: "STARTER", price: "Khách vãng lai", benefits: ["Free ship đơn > 500k", "Bảo hành 12 tháng", "Hỗ trợ chuẩn", "Cập nhật firmware"], isPromo: false },
              { level: "PROFESSIONAL", price: "VIP Member", benefits: ["Free ship mọi đơn", "Bảo hành 24 tháng", "Ưu tiên hỗ trợ 24/7", "Switch lẻ miễn phí", "Giảm 12% mọi đơn"], isPromo: true },
              { level: "ENTERPRISE", price: "Đại lý", benefits: ["Chiết khấu đại lý", "Support trực tiếp", "Hỗ trợ marketing", "Ưu tiên nhập kho", "API Access"], isPromo: false },
            ].map((p, i) => (
              <div key={i} className={`cy-pass-card ${p.isPromo ? 'promo' : ''}`} style={{ '--delay': `${i * 0.15}s` }}>
                {p.isPromo && <span className="cy-pass-badge">RECOMMENDED</span>}
                <h3 className="cy-pass-level">{p.level}</h3>
                <div className="cy-pass-price">{p.price}</div>
                <ul className="cy-pass-list">
                  {p.benefits.map((b, bi) => (
                    <li key={bi}><span className="cy-check">✓</span> {b}</li>
                  ))}
                </ul>
                <button className="cy-pass-btn">{i === 1 ? "UPGRADE NOW" : "START SESSION"}</button>
                <div className="cy-pass-corner-tl" />
                <div className="cy-pass-corner-br" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION 4 — FEATURES ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-features ${visHighlight ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refHighlight}>
        <div className="cy-section-inner cy-features-inner">
          {/* Left — Text */}
          <div className="cy-feat-text">
            <span className="cy-feat-eyebrow">{'>'} WHY SCYTOL CLX21</span>
            <h2 className="cy-feat-title">
              <span className="cy-glitch-line" data-text="ĐƯỢC XÂY DỰNG">ĐƯỢC XÂY DỰNG</span>
              <span className="cy-glitch-line cy-feat-line2" data-text="CHO NHỮNG">CHO NHỮNG</span>
              <span className="cy-glitch-line cy-feat-line3" data-text="CHIẾN BINH">CHIẾN BINH</span>
            </h2>
            <p className="cy-feat-desc">{'>'} Công nghệ gaming đỉnh cao — tốc độ, độ chính xác, phong cách._</p>
            <div className="cy-feat-stats">
              {[
                { num: '8KHz',   lbl: 'POLLING RATE' },
                { num: '0.08ms', lbl: 'ĐỘ TRỄ' },
                { num: '26K',    lbl: 'DPI' },
              ].map((s, i) => (
                <div key={i} className="cy-feat-stat-box">
                  <span className="cy-feat-stat-num">{s.num}</span>
                  <span className="cy-feat-stat-lbl">{s.lbl}</span>
                </div>
              ))}
            </div>
            <Link to="/keyboards" className="cy-feat-cta">
              KHÁM PHÁ NGAY →
            </Link>
          </div>

          {/* Right — HUD Panel */}
          <div className="cy-feat-hud">
            <div className="cy-hud-frame">
              <div className="cy-hud-header">
                <span className="cy-hud-tag">HUD_DISPLAY_V.9</span>
                <span className="cy-hud-status">● ONLINE</span>
              </div>
              <div className="cy-hud-img-wrap">
                {featuredMouse?.image && <img src={featuredMouse.image} alt={featuredMouse.name} className="cy-hud-img" />}
              </div>
              <div className="cy-hud-metrics">
                <div className="cy-hud-metric">
                  <span className="cy-hud-metric-val" style={{ color: '#ff00ff' }}>98%</span>
                  <span className="cy-hud-metric-lbl">ACCURACY</span>
                </div>
                <div className="cy-hud-metric">
                  <span className="cy-hud-metric-val" style={{ color: '#00ff88' }}>0.08ms</span>
                  <span className="cy-hud-metric-lbl">LATENCY</span>
                </div>
                <div className="cy-hud-metric">
                  <span className="cy-hud-metric-val" style={{ color: '#00d4ff' }}>8KHz</span>
                  <span className="cy-hud-metric-lbl">POLLING</span>
                </div>
              </div>
              <div className="cy-hud-corner cy-hud-corner-tl" />
              <div className="cy-hud-corner cy-hud-corner-tr" />
              <div className="cy-hud-corner cy-hud-corner-bl" />
              <div className="cy-hud-corner cy-hud-corner-br" />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION E — USER_FEEDBACK_LOG ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-feedback-log ${visFeedback ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refFeedback}>
        <div className="cy-section-inner">
          <div className="cy-section-header" style={{ textAlign: 'center', width: '100%', marginBottom: '60px' }}>
            <span className="cy-terminal-prompt">USER_FEEDBACK_LOG</span>
            <h2 className="cy-glitch-title" data-text="ĐÁNH GIÁ TỪ GAME THỦ" style={{ margin: '10px 0' }}>ĐÁNH GIÁ TỪ GAME THỦ</h2>
            <div className="cy-header-line" style={{ margin: '20px auto', width: '200px' }} />
          </div>
          
          <div className="cy-feedback-grid">
            {[
              { name: "Minh Tuấn", role: "Game thủ FPS", review: "Bàn phím cơ mua ở đây xịn vãi, gõ sướng tay, ship nhanh, đóng gói cênt thận. Sẽ quay lại mua tiếp!", img: 1 },
              { name: "Hồng Nhung", role: "Streamer", review: "Tai nghe chất lượng hơn mong đợi, âm bass cực đỉnh. Shop tư vấn nhiệt tình, giao hàng đúng hẹn.", img: 2 },
              { name: "Quốc Bảo", role: "Game thủ MOBA", review: "Chuột gaming 26K DPI mượt không tưởng. Setup của tôi lên level hẳn sau khi mua ở đây.", img: 3 },
              { name: "Thu Hà", role: "Content Creator", review: "Phụ kiện đa dạng, giá hợp lý, bảo hành tốt. Đây là shop gaming gear uy tín nhất tôi từng mua.", img: 4 },
            ].map((r, i) => (
              <div key={i} className="cy-feedback-card" style={{ '--delay': `${i * 0.1}s` }}>
                <div className="cy-card-header">
                  <div className="cy-user-info">
                    <img src={`https://i.pravatar.cc/48?img=${r.img + 10}`} alt={r.name} className="cy-avatar" />
                    <div>
                      <h4 className="cy-user-name">{r.name}</h4>
                      <span className="cy-user-role">{r.role}</span>
                    </div>
                  </div>
                  <span className="cy-verified-badge">VERIFIED</span>
                </div>
                <div className="cy-card-body">
                  <p>"{r.review}"</p>
                </div>
                <div className="cy-card-footer">
                   <span className="cy-transmission">• TRANSMISSION_COMPLETE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ SECTION F — FAQ + INITIATE_LAUNCH ━━━━━━━━━━━━━━━━ */}
      <section className={`cy-faq-launch ${visFaq ? 'cy-reveal-in' : 'cy-reveal-out'}`} ref={refFaq}>
        <div className="cy-section-inner">
          <div className="cy-faq-accordion">
            {[
              { q: "Sản phẩm có bảo hành không?", a: "Tất cả sản phẩm tại SCYTOL CLX21 đều được bảo hành chính hãng từ 12-24 tháng tùy dòng sản phẩm. Lỗi 1 đổi 1 trong 30 ngày đầu." },
              { q: "Giao hàng bao lâu thì nhận được?", a: "Nội thành Hà Nội/TP.HCM: 2-4h (hỏa tốc) hoặc trong ngày. Các tỉnh khác: 2-3 ngày làm việc." },
              { q: "Có đổi trả nếu sản phẩm lỗi không?", a: "Chắc chắn rồi! Nếu phát hiện lỗi nhà sản xuất, chúng tôi hỗ trợ đổi mới hoàn toàn miễn phí hoặc hoàn tiền 100%." },
              { q: "Thanh toán bằng hình thức nào?", a: "Hỗ trợ trả góp 0%, thanh toán qua thẻ tín dụng, chuyển khoản VietQR, hoặc COD (nhận hàng rồi mới trả tiền)." },
              { q: "Có ship toàn quốc không?", a: "Chúng tôi ship toàn quốc với hệ thống vận chuyển nhanh nhất. Đơn hàng trên 1 triệu luôn được free ship." },
              { q: "Làm sao để theo dõi đơn hàng?", a: "Sau khi đặt, hệ thống sẽ gửi mã vận đơn qua email/SMS. Bạn có thể tra cứu trực tiếp tại mục 'Đơn hàng của tôi'." },
            ].map((f, i) => (
              <div key={i} className={`cy-faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="cy-faq-q">
                  <span className="cy-prefix">$</span>
                  <span className="cy-q-text">{f.q}</span>
                  <ChevronRight size={18} className="cy-faq-icon" />
                </div>
                <div className="cy-faq-a">
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cy-initiate-launch">
            <h2 className="cy-glitch-title" data-text="NÂNG_CẤP_SETUP.EXE">NÂNG_CẤP_SETUP.EXE</h2>
            <p className="cy-launch-sub">Hàng nghìn game thủ đã nâng cấp setup cùng SCYTOL CLX21</p>
            <form className="cy-launch-form" onSubmit={(e) => e.preventDefault()}>
               <div className="cy-email-wrap">
                  <span className="cy-input-prefix">{">"}</span>
                  <input type="email" placeholder="ENTER_EMAIL_ADDRESS" className="cy-launch-input" />
               </div>
               <button type="submit" className="cy-launch-btn">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;