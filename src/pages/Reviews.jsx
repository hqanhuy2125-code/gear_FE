import React, { useState, useEffect } from 'react';
import { Star, Filter, ArrowUpDown } from 'lucide-react';
import '../styles/Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [starFilter, setStarFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [sortBy, setSortBy] = useState('oldest');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:5130/api/reviews', {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Reviews data fetched:", data);
        setReviews(data);
        setFilteredReviews(data);
      } else {
        console.error("API Response not OK:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...reviews];

    // Filter by stars
    if (starFilter !== 'all') {
      result = result.filter(r => r.rating === parseInt(starFilter));
    }

    // Filter by product
    if (productFilter !== 'all') {
      result = result.filter(r => r.productName === productFilter);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.rating - b.rating);
    }

    setFilteredReviews(result);
  }, [starFilter, productFilter, sortBy, reviews]);

  const uniqueProducts = [...new Set(reviews.map(r => r.productName))];

  if (loading) return <div className="reviews-loading">Đang tải đánh giá...</div>;

  return (
    <div className="reviews-page">
      <header className="reviews-header">
        <div className="container">
          <h1>Cộng đồng Đánh giá</h1>
          <p>Chia sẻ trải nghiệm và khám phá ý kiến từ những game thủ khác</p>
        </div>
      </header>

      <div className="container">
        <div className="reviews-filters-bar">
          <div className="filter-group">
            <label><Star size={18} /> Số sao:</label>
            <select value={starFilter} onChange={(e) => setStarFilter(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="5">5 Sao</option>
              <option value="4">4 Sao</option>
              <option value="3">3 Sao</option>
              <option value="2">2 Sao</option>
              <option value="1">1 Sao</option>
            </select>
          </div>

          <div className="filter-group">
            <label><Filter size={18} /> Sản phẩm:</label>
            <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
              <option value="all">Tất cả sản phẩm</option>
              {uniqueProducts.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label><ArrowUpDown size={18} /> Sắp xếp:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="oldest">Mặc định (Tên hay)</option>
              <option value="newest">Mới nhất</option>
              <option value="highest">Đánh giá cao nhất</option>
              <option value="lowest">Đánh giá thấp nhất</option>
            </select>
          </div>
        </div>

        <div className="reviews-grid">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <div key={review.id} className="review-card-shared">
                <div className="rc-user-info">
                  <div className="rc-avatar">{(review.nickName || review.userName || 'U').charAt(0).toUpperCase()}</div>
                  <div className="rc-meta">
                    <span className="rc-name">{review.nickName || review.userName || 'Người dùng ẩn'}</span>
                    <span className="rc-date">{review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                </div>

                <div className="rc-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? "#fbbf24" : "none"} 
                      color={i < review.rating ? "#fbbf24" : "#cbd5e1"} 
                    />
                  ))}
                </div>

                <p className="rc-comment">{review.comment || "Không có nhận xét."}</p>

                <div className="rc-product-ref">
                  <img 
                    src={review.productImage || 'https://via.placeholder.com/60?text=No+Img'} 
                    alt={review.productName} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=No+Img'; }}
                  />
                  <div className="rc-p-info">
                    <span className="rc-label">Đánh giá cho:</span>
                    <span className="rc-p-name">{review.productName}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="reviews-empty">
              <p>Không tìm thấy đánh giá nào phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
