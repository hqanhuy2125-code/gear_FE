import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import '../styles/ProductCard.css';

const ProductCard = ({ 
  id, name, price, image, imageUrl, colors, sale, discount, 
  stock, isPreOrder, preOrderDate, isOrderOnly 
}) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  // Image source comes from products.js/backend
  const productImage = image || imageUrl;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0 && !isPreOrder && !isOrderOnly) return;
    addToCart({ id, name, price, image: productImage, sale, discount, stock, isPreOrder, isOrderOnly });
  };

  const handleToggleAdminField = async (e, field, value) => {
    e.preventDefault();
    e.stopPropagation();
    const endpoint = field === 'isPreOrder' ? 'toggle-preorder' : 'toggle-orderonly';
    try {
      await api.patch(`/api/products/${id}/${endpoint}`, !value);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
        alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
        return;
    }
    
    // Optimistic toggle
    setIsWishlisted(!isWishlisted);
    
    try {
        await api.post('/api/wishlist/toggle', { userId: user.id, productId: id });
    } catch (err) {
        setIsWishlisted(isWishlisted); // Revert on failure
        console.error(err);
    }
  };

  React.useEffect(() => {
    if (user) {
        const checkWishlist = async () => {
            try {
                const { data } = await api.get(`/api/wishlist/${user.id}`);
                setIsWishlisted(data.some(p => p.id === id || p.productId === id));
            } catch (err) {
                console.error('Wishlist fetch failed:', err);
            }
        };
        checkWishlist();
    }
  }, [user, id]);

  const displayColors = colors || ['#000000', '#FFFFFF', '#CCCCCC'];
  
  // Fix SALE logic to be robust
  const hasDiscount = discount > 0;
  const isActuallyOnSale = sale && hasDiscount;
  const discountedPrice = isActuallyOnSale ? price * (1 - discount / 100) : price;

  return (
    <Link to={`/product/${id}`} className={`product-card minimal ${isActuallyOnSale ? 'on-sale' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-image-wrap">
        {/* LOGISTICS BADGES (Priority: OutOfStock > Pre-order > Order > Sale) */}
        <div className="logistics-badges">
          {stock === 0 && !isPreOrder && !isOrderOnly ? (
            <span className="badge-outofstock">HẾT HÀNG</span>
          ) : isPreOrder ? (
            <span className="badge-preorder">ĐẶT TRƯỚC</span>
          ) : isOrderOnly ? (
            <span className="badge-orderonly">ORDER</span>
          ) : isActuallyOnSale ? (
            <span className="badge-sale">SALE -{discount}%</span>
          ) : null}
        </div>

        <button 
           className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
           onClick={toggleWishlist}
           title="Yêu thích"
        >
           <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
          <img 
            src={productImage} 
            alt={name} 
            className="product-image" 
            loading="lazy"
            onError={(e) => {
              e.target.src = '/placeholder.jpg'
            }}
          />
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

        {isPreOrder && preOrderDate && (
          <p className="preorder-date">Dự kiến: {new Date(preOrderDate).toLocaleDateString('vi-VN')}</p>
        )}

        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
          disabled={stock <= 0 && !isPreOrder && !isOrderOnly}
        >
          {stock <= 0 && !isPreOrder && !isOrderOnly ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </button>

        {/* ADMIN QUICK TOGGLES */}
        {user && user.role === 'admin' && (
          <div className="admin-card-toggles" onClick={e => e.preventDefault()}>
            <button 
              className={`toggle-btn ${isPreOrder ? 'active' : ''}`}
              onClick={(e) => handleToggleAdminField(e, 'isPreOrder', isPreOrder)}
            >
              Đặt trước
            </button>
            <button 
              className={`toggle-btn ${isOrderOnly ? 'active' : ''}`}
              onClick={(e) => handleToggleAdminField(e, 'isOrderOnly', isOrderOnly)}
            >
              Đặt hàng (3-7 ngày)
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
