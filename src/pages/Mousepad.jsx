import React from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import '../styles/CategoryPage.css';

const Mousepad = () => {
  const mousepadProducts = products.filter(p => p.category === 'mousepad');

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
            {mousepadProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mousepad;
