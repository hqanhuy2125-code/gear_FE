import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ id, name, price, image, colors, sale, discount }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  const displayColors = colors || ['#000000', '#FFFFFF', '#CCCCCC'];
  const discountedPrice = sale ? price * (1 - discount / 100) : price;

  return (
    <div className={`product-card minimal ${sale ? 'on-sale' : ''}`}>
      <div className="product-image-wrap">
        {sale && <span className="sale-label">SALE</span>}
        <img src={image} alt={name} className="product-image" />
      </div>
      
      <div className="product-info-minimal">
        <div className="color-swatches">
          {displayColors.map((color, index) => (
            <span 
              key={index} 
              className="color-swatch" 
              style={{ backgroundColor: color }}
              title={color === '#000000' ? 'Black' : color === '#FFFFFF' ? 'White' : 'Color'}
            />
          ))}
        </div>
        
        <h3 className="product-title">{name}</h3>
        
        <div className="price-container">
          {sale && (
            <span className="original-price">
              {price.toLocaleString('vi-VN')} ₫
            </span>
          )}
          <p className="product-price">
            {discountedPrice.toLocaleString('vi-VN')} ₫
          </p>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
