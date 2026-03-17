import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import '../styles/CategoryPage.css';

const Sale = () => {
  const saleProducts = products.filter(p => p.sale);
  const [showToast, setShowToast] = useState(false);
  const [toastHiding, setToastHiding] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowToast(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleCloseToast = () => {
    setToastHiding(true);
    setTimeout(() => setShowToast(false), 300);
  };

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => handleCloseToast(), 5000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  return (
    <div className="all-products-page sale-theme">

      {showToast && (
        <div className={`sale-welcome-toast ${toastHiding ? 'hiding' : ''}`}>
          <span className="toast-icon">🔥</span>
          <div className="toast-text">
            <strong>FLASH SALE đang diễn ra!</strong>
            <span>Giảm đến 50% — Chỉ còn hôm nay. Đừng bỏ lỡ!</span>
          </div>
          <button onClick={handleCloseToast}>×</button>
        </div>
      )}

      <header className="all-products-header">
        <div className="container">
          <h1>SPECIAL OFFERS</h1>
          <p>Cơ hội sở hữu các thiết bị SCYTOL với mức giá hấp dẫn nhất.</p>
        </div>
      </header>

      <section className="all-products-content section-white">
        <div className="container">
          <div className="products-grid">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sale;