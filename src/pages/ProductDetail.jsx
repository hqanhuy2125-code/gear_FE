import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { products } from '../data/products';
import { Star, StarHalf, Trash2, ArrowLeft } from 'lucide-react';
import '../styles/ProductDetail.css';

const API_BASE = 'http://localhost:5130';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  
  const product = products.find(p => p.id === parseInt(id));
  
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (product) {
      fetchReviews();
      if (user) checkPurchaseStatus();
    }
  }, [product, user]);

  const checkPurchaseStatus = async () => {
    try {
        const res = await fetch(`${API_BASE}/api/orders/user/${user.id}`);
        if (res.ok) {
            const orders = await res.json();
            // Check if any order contains this product and is not pending/cancelled
            const purchased = orders.some(o => 
                (o.status === 'Completed' || o.status === 'Delivered' || o.status === 'Shipping') && 
                o.orderItems.some(oi => oi.productId === parseInt(id))
            );
            setHasPurchased(purchased);
        }
    } catch (err) {
        console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews/product/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    if (product) addToCart(product);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Bạn cần đăng nhập để đánh giá');
      return;
    }
    setError('');
    setMsg('');

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(id),
          userId: user.id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMsg('Đánh giá thành công!');
        setComment('');
        fetchReviews();
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi kết nối');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <div className="detail-container">Không tìm thấy sản phẩm.</div>;

  const salePrice = product.sale ? Math.round(product.price * (1 - product.discount / 100)) : null;
  const currentPrice = salePrice || product.price;

  // Tính điểm trung bình
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="detail-top">
          <div className="detail-image-wrap">
            {product.sale && <span className="detail-sale-badge">SALE -{product.discount}%</span>}
            <img src={product.image} alt={product.name} className="detail-image" />
          </div>
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            <div className="detail-rating-summary">
              <Star className="star-icon filled" size={20} />
              <span>{avgRating} ({reviews.length} đánh giá)</span>
            </div>
            
            <div className="detail-prices">
              {salePrice && <span className="detail-old-price">{product.price.toLocaleString('vi-VN')} ₫</span>}
              <span className="detail-price">{currentPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <p className="detail-desc">
              Sản phẩm cao cấp từ thương hiệu SCYTOL CLX21. Được thiết kế đặc biệt cho game thủ chuyên nghiệp, mang lại trải nghiệm tuyệt vời và hiệu suất tối đa trong mọi trận chiến.
            </p>

            <button className="detail-add-cart" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <div className="review-section">
          <h2>Đánh Giá Sản Phẩm</h2>
          
          <div className="review-summary-board">
            <div className="rs-left">
              <span className="rs-score">{avgRating}</span>
              <span className="rs-total">/ 5</span>
              <p>{reviews.length} đánh giá</p>
            </div>
            <div className="rs-right">
              {user && hasPurchased ? (
                <form className="review-form" onSubmit={handleSubmitReview}>
                  <h4>Viết đánh giá của bạn</h4>
                  {error && <div className="review-error">{error}</div>}
                  {msg && <div className="review-success">{msg}</div>}
                  <div className="rating-select">
                    <span>Số sao: </span>
                    <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} sao</option>)}
                    </select>
                  </div>
                  <textarea 
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này (tùy chọn)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button type="submit" className="btn-submit-review">Gửi đánh giá</button>
                </form>
              ) : user && !hasPurchased ? (
                <div className="review-login-prompt">
                  Bạn cần mua và nhận hàng thành công để có thể đánh giá sản phẩm này.
                </div>
              ) : (
                <div className="review-login-prompt">
                  Vui lòng <Link to="/login" style={{color: 'var(--clr-accent)', textDecoration: 'underline'}}>đăng nhập</Link> để đánh giá.
                </div>
              )}
            </div>
          </div>

          <div className="review-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">Chưa có đánh giá nào cho sản phẩm này.</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="review-item">
                  <div className="ri-header">
                    <div className="ri-user-info">
                      <div className="ri-avatar">{r.userName?.charAt(0).toUpperCase() || 'U'}</div>
                      <div className="ri-meta">
                        <strong>{r.userName}</strong>
                        <span className="ri-date">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    {/* Delete button for Admin/Owner */}
                    {user && (user.role === 'admin' || user.role === 'owner') && (
                      <button className="btn-delete-review" title="Xóa đánh giá" onClick={() => handleDeleteReview(r.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="ri-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={`star-icon ${i < r.rating ? 'filled' : ''}`} />
                    ))}
                  </div>
                  {r.comment && <p className="ri-comment">{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
