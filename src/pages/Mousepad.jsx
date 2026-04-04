import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPageAddons from '../components/ProductPageAddons';
import '../styles/CategoryPage.css';

const API_BASE = 'http://localhost:5130';

const Mousepad = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/products?pageSize=100`)
      .then(res => res.json())
      .then(data => {
        const prods = data.items || [];
        setProducts(prods.map(p => ({ ...p, image: p.imageUrl })).filter(p => (p.category || '').toLowerCase() === 'mousepad'));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="all-products-page">
      <header className="all-products-header">
        <div className="container">
          <h1>Mouse Pads</h1>
          <p>Premium surfaces for total control and flawless glide</p>
        </div>
      </header>

      <section className="all-products-content section-white">
        <div className="container">
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mousepad;
