import React, { useEffect, useState } from 'react';
import '../styles/Account.css';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const getInitialWishlistIds = () => {
  const stored = localStorage.getItem('wishlistProductIds');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  // Seed with a few products so page không trống
  const seeded = products.slice(0, 4).map((p) => p.id);
  localStorage.setItem('wishlistProductIds', JSON.stringify(seeded));
  return seeded;
};

const Wishlist = () => {
  const [wishlistIds, setWishlistIds] = useState(getInitialWishlistIds);

  useEffect(() => {
    localStorage.setItem('wishlistProductIds', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const wishlistProducts = products.filter((p) =>
    wishlistIds.includes(p.id),
  );

  const handleRemove = (id) => {
    setWishlistIds((prev) => prev.filter((pid) => pid !== id));
  };

  return (
    <div className="container account-page">
      <div className="account-card">
        <h1 className="account-title">Danh sách yêu thích</h1>

        {wishlistProducts.length === 0 ? (
          <p className="account-text">
            Bạn chưa lưu sản phẩm nào vào wishlist. Hãy khám phá các sản phẩm và lưu lại những món
            bạn yêu thích.
          </p>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="wishlist-card-wrapper">
                <button
                  type="button"
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(product.id)}
                >
                  ✕
                </button>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

