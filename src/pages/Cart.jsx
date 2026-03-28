import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart, cartCount } = useContext(CartContext);
  const [successAlert, setSuccessAlert] = useState(false);
  const [lastAdded, setLastAdded] = useState('');
  const [cartReminder, setCartReminder] = useState(true);
  const [reminderHiding, setReminderHiding] = useState(false);

  useEffect(() => {
    const msg = sessionStorage.getItem('cart_added');
    if (msg) {
      setLastAdded(msg);
      setSuccessAlert(true);
      sessionStorage.removeItem('cart_added');
      const t = setTimeout(() => setSuccessAlert(false), 4000);
      // NOTE: not clearing timeout here specifically because of concurrent effect, but letting it GC.
    }
    
    const tRemind = setTimeout(() => {
      setReminderHiding(true);
      setTimeout(() => setCartReminder(false), 300);
    }, 5000);
    return () => clearTimeout(tRemind);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-bg">
        <div className="container empty-cart-container">
          <h2>GIỎ HÀNG CỦA BẠN ĐANG TRỐNG</h2>
          <p>Có vẻ như bạn chưa chọn sản phẩm nào.</p>
          <Link to="/" className="continue-shopping-btn">TIẾP TỤC MUA THÊM</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-bg">

      {successAlert && (
        <div className="cart-success-alert">
          <CheckCircle size={20} />
          <span>🎉 Đã thêm <strong>{lastAdded}</strong> vào giỏ hàng thành công!</span>
          <button onClick={() => setSuccessAlert(false)}>×</button>
        </div>
      )}

      <div className="cart-container">
        {cartReminder && (
          <div className={`cart-reminder-banner ${reminderHiding ? 'hiding' : ''}`}>
            <span>🛒 Bạn có <strong>{cartCount}</strong> sản phẩm trong giỏ. Hoàn tất thanh toán để nhận hàng sớm nhất!</span>
          </div>
        )}
        <h1 className="cart-title">GIỎ HÀNG</h1>

        {/* PROMOTION PROGRESS BAR */}
        <div className="cart-promo-section">
          {cartTotal >= 5000000 ? (
            <div className="promo-unlocked">
              <span className="promo-icon">🎊</span>
              <div className="promo-info">
                <strong>Chúc mừng! Bạn đã được giảm 20%</strong>
                <p>Mức giảm tối đa 2.000.000₫ đã được áp dụng tự động.</p>
              </div>
            </div>
          ) : (
            <div className="promo-progress-wrap">
              <div className="promo-header">
                <span>Còn <strong>{(5000000 - cartTotal).toLocaleString('vi-VN')}₫</strong> nữa để nhận ưu đãi 20%</span>
                <span className="promo-percent">{Math.round((cartTotal / 5000000) * 100)}%</span>
              </div>
              <div className="promo-bar-bg">
                <div className="promo-bar-fill" style={{ width: `${Math.min(100, (cartTotal / 5000000) * 100)}%` }}></div>
              </div>
              <p className="promo-hint">Đơn từ 5.000.000₫ giảm ngay 20% (tối đa 2M)</p>
            </div>
          )}
        </div>

        <div className="cart-content">
          <div className="cart-items-list">
            <div className="cart-header">
              <span>Sản phẩm</span>
              <span>Giá</span>
              <span>Số lượng</span>
              <span>Tổng</span>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-product">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">{item.price.toLocaleString('vi-VN')} ₫</div>
                <div className="cart-item-quantity">
                  <button onClick={() => decreaseQuantity(item.id)}><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}><Plus size={16} /></button>
                </div>
                <div className="cart-item-subtotal">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</div>
              </div>
            ))}
          </div>

          <div className="cart-summary-box">
            <h3>TÓM TẮT ĐƠN HÀNG</h3>
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng</span>
              <span>Tính khi thanh toán</span>
            </div>
            {cartTotal >= 5000000 && (
              <div className="summary-row promo-discount">
                <span>Ưu đãi (20%)</span>
                <span>-{Math.min(2000000, cartTotal * 0.2).toLocaleString('vi-VN')} ₫</span>
              </div>
            )}
            <div className="summary-total">
              <span>Tổng tiền</span>
              <span>{(cartTotal - (cartTotal >= 5000000 ? Math.min(2000000, cartTotal * 0.2) : 0)).toLocaleString('vi-VN')} ₫</span>
            </div>
            <Link to="/checkout" className="checkout-btn">THANH TOÁN</Link>
            <Link to="/" className="continue-btn">Tiếp tục mua hàng</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;