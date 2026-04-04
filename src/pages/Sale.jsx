import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import '../styles/CategoryPage.css';

const API_BASE = 'http://localhost:5130';

const Sale = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copied, setCopied] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeFlashSale, setActiveFlashSale] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, flashRes] = await Promise.all([
          fetch(`${API_BASE}/api/products?pageSize=100`).then(r=>r.json()),
          fetch(`${API_BASE}/api/flash-sales`).then(r=>r.json()).catch(() => ([]))
        ]);
        
        const prods = (prodRes.items || []).filter(p => !p.isHidden).map(p => ({ ...p, image: p.imageUrl }));
        const now = new Date();
        const activeFS = flashRes.find(fs => fs.isActive && new Date(fs.startTime) <= now && new Date(fs.endTime) >= now);
        
        if (activeFS && activeFS.productIds) {
          setActiveFlashSale(activeFS);
          const saleProductIds = activeFS.productIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
          
          setProducts(prods.map(p => {
             if (saleProductIds.includes(p.id)) {
                 return { ...p, sale: true, discount: activeFS.discountPercent };
             }
             return p;
          }));
        } else {
          setProducts(prods);
        }
      } catch (err) {
        console.error("Failed to load generic products", err);
      }
    };
    fetchData();
  }, []);

  const currentHour = currentTime.getHours();
  // ... rest of the timing logic ...
  let isFlashSaleActive = !!activeFlashSale;
  let targetHour = activeFlashSale ? new Date(activeFlashSale.endTime).getHours() : 0;
  let nextSaleHour = 8;
  
  if (!isFlashSaleActive) {
      if (currentHour < 8 || currentHour >= 22) {
        nextSaleHour = 8;
      } else if (currentHour >= 12 && currentHour < 13) {
        nextSaleHour = 13;
      }
  }

  // Countdown string
  const getCountdownStr = () => {
    if (isFlashSaleActive) {
      const target = new Date(activeFlashSale.endTime);
      const diff = target - currentTime;
      if (diff <= 0) return '00:00:00';
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    } else {
      const target = new Date(currentTime);
      if (currentHour >= 22) {
        target.setDate(target.getDate() + 1);
        target.setHours(8, 0, 0, 0);
      } else {
        target.setHours(nextSaleHour, 0, 0, 0);
      }
      const diff = target - currentTime;
      if (diff <= 0) return '00:00:00';
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
  };

  const d = new Date();
  const dayStr = d.getDate().toString().padStart(2, '0');
  const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
  const couponCode = `FLASH${dayStr}${monthStr}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saleProducts = products.filter(p => p.sale);

  const pulseStyle = isFlashSaleActive ? {
    animation: 'flashPulse 2s infinite',
  } : {};

  return (
    <div className="all-products-page sale-theme">

      <style>{`
        @keyframes flashPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { box-shadow: 0 0 24px 8px rgba(255, 100, 50, 0.5); }
        }
      `}</style>

      {/* FLASH SALE BANNER */}
      <div style={{
        marginTop: '76px',
        background: isFlashSaleActive
          ? 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)'
          : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: '#fff',
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s',
        ...pulseStyle,
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

          {/* Title Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '2px' }}>
              ⚡ FLASH SALE
            </h2>

            {/* Countdown */}
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              padding: '8px 20px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '0.85rem', color: isFlashSaleActive ? '#ffaaaa' : '#94a3b8' }}>
                {isFlashSaleActive ? 'Kết thúc trong:' : `Flash Sale tiếp theo lúc ${nextSaleHour >= 22 ? '8:00 ngày mai' : `${nextSaleHour}:00`}:`}
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fbbf24' }}>
                {getCountdownStr()}
              </span>
            </div>
          </div>

          {/* Coupon - only when active */}
          {isFlashSaleActive && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.12)',
              padding: '10px 20px',
              borderRadius: '28px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.25)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1rem' }}>Mã giảm giá hôm nay:</span>
              <strong style={{ fontSize: '1.4rem', color: '#fbbf24', letterSpacing: '2px' }}>{couponCode}</strong>
              <button
                onClick={handleCopyCode}
                style={{
                  background: 'white',
                  color: '#dc2626',
                  border: 'none',
                  padding: '7px 18px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  fontSize: '0.95rem',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {copied ? <><CheckCircle2 size={16} /> ĐÃ CHÉP</> : <><Copy size={16} /> COPY</>}
              </button>
            </div>
          )}

          {/* Inactive message */}
          {!isFlashSaleActive && (
            <p style={{ margin: 0, fontSize: '1.05rem', opacity: 0.8 }}>
              Flash Sale diễn ra mỗi ngày từ <strong>8:00 – 12:00</strong> và <strong>13:00 – 22:00</strong>. Hẹn gặp bạn!
            </p>
          )}
        </div>

        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40%', left: '-5%', width: '250px', height: '250px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-60%', right: '8%', width: '350px', height: '350px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      <header className="all-products-header" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <h1>SPECIAL OFFERS</h1>
          <p>Cơ hội sở hữu các thiết bị SCYTOL với mức giá hấp dẫn nhất.</p>
        </div>
      </header>

      <section className="all-products-content section-white">
        <div className="container">
          <div className="products-grid">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} {...product} originalPrice={product.originalPrice} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sale;