import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    alert("Đặt hàng thành công!");
    clearCart();
    navigate('/');
  };

  return (
    <div className="checkout-page-bg">
      <div className="checkout-content">
        <h1 className="checkout-title">THANH TOÁN</h1>

        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            <input type="text" id="fullName" placeholder="Nguyễn Văn A" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="email@fgg.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input type="tel" id="phone" placeholder="0123 456 789" required />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <textarea id="address" placeholder="Địa chỉ giao hàng" rows="3" required></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="payment">Phương thức thanh toán</label>
            <select id="payment" required>
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="card">Thẻ tín dụng</option>
            </select>
          </div>

          <div className="checkout-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <p>Số lượng sản phẩm: <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span></p>
            <p className="checkout-total">Tổng tiền: <span>{cartTotal.toLocaleString('vi-VN')} ₫</span></p>
          </div>

          <button type="submit" className="place-order-btn">
            Đặt hàng
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;