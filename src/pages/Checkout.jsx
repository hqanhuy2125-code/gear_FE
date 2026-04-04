import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../api'; // axiosInstance with auto-refresh interceptor
import '../styles/Checkout.css';

/* ── tiny inline Toast ── */
const CheckoutToast = ({ toast }) => {
  if (!toast) return null;
  const isErr = toast.type === 'error';
  return (
    <div
      style={{
        position: 'fixed', top: 90, right: 24, zIndex: 9999,
        background: isErr
          ? 'linear-gradient(135deg,#dc2626,#b91c1c)'
          : 'linear-gradient(135deg,#16a34a,#15803d)',
        color: '#fff', padding: '16px 20px', borderRadius: 14,
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: `0 8px 32px ${isErr ? 'rgba(220,38,38,.35)' : 'rgba(22,163,74,.35)'}`,
        maxWidth: 360, animation: 'toastSlideIn .4s cubic-bezier(.23,1,.32,1)',
      }}
    >
      <span style={{ fontSize: 24 }}>{isErr ? '❌' : '✅'}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <strong style={{ fontSize: 14 }}>{toast.title}</strong>
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.85)' }}>{toast.msg}</span>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    paymentType: 'COD', // 'COD' | 'ONLINE'
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Early redirect if not logged in, or fetch user profile
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    api.get('/api/users/profile')
      .then(res => {
        const data = res.data;
        setForm(prev => ({
          ...prev,
          fullName: prev.fullName || data.name || user.name || '',
          phone: prev.phone || data.phoneNumber || data.phone || '',
          address: prev.address || data.address || ''
        }));
      })
      .catch(err => console.error('Failed to load user profile for checkout', err));
  }, [user, navigate]);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { id, code, type, value }
  const [discountAmount, setDiscountAmount] = useState(0);

  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [pendingOrderCode, setPendingOrderCode] = useState(null);
  const [qrData, setQrData] = useState(null); // String for react-qr-code, or 'VIETQR' indicator
  const [isQrLoading, setIsQrLoading] = useState(false);

  const showToast = (type, title, msg) => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApplyVoucher = async () => {
    if (!voucherCode) return;
    try {
      const { data } = await api.post('/api/vouchers/apply', { code: voucherCode, totalAmount: cartTotal });
      setAppliedVoucher(data);
      let disc = 0;
      if (data.type === 'percent') {
        disc = cartTotal * (data.value / 100);
      } else {
        disc = data.value;
      }
      setDiscountAmount(disc);
      showToast('success', 'Thành công', `Đã áp dụng mã ${data.code}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Voucher không hợp lệ hoặc hết hạn';
      showToast('error', 'Lỗi Voucher', msg);
      setAppliedVoucher(null);
      setDiscountAmount(0);
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  // Helper to create an order on backend — api.js handles the Bearer token automatically
  const createOrderOnBackend = async (paymentMethodLabel) => {
    const payload = {
      userId: user.id,
      fullName: form.fullName,
      phoneNumber: form.phone,
      shippingAddress: form.address,
      paymentMethod: paymentMethodLabel,
      voucherCode: appliedVoucher ? appliedVoucher.code : null,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        productName: item.name,
        price: item.price,
        imageUrl: item.image
      })),
    };

    const { data } = await api.post('/api/orders', payload);
    return data; // { id: 123, ... }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      showToast('error', 'Giỏ hàng trống!', 'Vui lòng thêm sản phẩm trước khi đặt hàng.');
      return;
    }
    if (!form.fullName || !form.phone || !form.address) {
       showToast('error', 'Thiếu thông tin!', 'Vui lòng điền đủ thông tin giao hàng ở trên.');
       return;
    }
    setCheckoutStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setLoading(true);
    try {
      if (form.paymentType === 'COD') {
        await createOrderOnBackend('COD');
        clearCart();
        showToast('success', 'Đặt hàng thành công! 🎉', 'Đơn hàng COD của bạn đã được ghi nhận.');
        setTimeout(() => navigate('/orders'), 1800);
      } else {
        // ONLINE
        let orderId = pendingOrderId;
        let orderCode = pendingOrderCode;
        if (!orderId) {
          const order = await createOrderOnBackend('Chuyển khoản QR');
          orderId = order.id;
          orderCode = order.orderCode;
          setPendingOrderId(orderId);
          setPendingOrderCode(orderCode);
        }
        
        // Format addInfo: SCYTOL {OrderCode}
        const addInfo = encodeURIComponent(`SCYTOL ${orderCode}`);
        const qrUrl = `https://img.vietqr.io/image/970422-2234502012005-compact.png?amount=${finalTotal}&addInfo=${addInfo}&accountName=HA%20QUANG%20HUY`;
        setQrData(qrUrl);
        setSelectedMethod({ type: 'BANK', name: 'Chuyển khoản QR' }); 
        setCheckoutStep(3);
      }
    } catch (err) {
      const errDetail = err.response?.data;
      let errMsg = 'Lỗi kết nối máy chủ';
      if (errDetail) {
        if (typeof errDetail === 'string') errMsg = errDetail;
        else if (errDetail.message) errMsg = errDetail.message;
        else if (errDetail.errors) {
          const allErrors = Object.values(errDetail.errors).flat();
          errMsg = allErrors.join('; ');
        }
      } else if (err.message) {
        errMsg = err.message;
      }
      showToast('error', 'Đặt hàng thất bại', errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Polling logic for online payment
  useEffect(() => {
    let intervalId;
    if (checkoutStep === 3 && pendingOrderId) {
      intervalId = setInterval(async () => {
        try {
          const { data } = await api.get(`/api/orders/${pendingOrderId}`);
          if (data.status === 'Paid') {
            clearInterval(intervalId);
            clearCart();
            showToast('success', 'Thanh toán thành công! 🎉', 'Cảm ơn bạn đã mua sắm.');
            setTimeout(() => navigate('/orders'), 2000);
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 3000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkoutStep, pendingOrderId, navigate, clearCart]);

  // Called when clicking "Hoàn tất đơn hàng" after QR is shown
  const handleFinalizeOnlineOrder = () => {
    clearCart();
    showToast('success', 'Đã ghi nhận! 🎉', 'Vui lòng chờ hệ thống xác nhận thanh toán.');
    setTimeout(() => navigate('/orders'), 1500);
  };

  // Styles for the new inline UI
  const inlineStyles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: '12px',
      marginTop: '1rem',
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    gridItem: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    logo: {
      width: '100%',
      height: '40px',
      objectFit: 'contain'
    },
    methodName: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: '#374151',
      textAlign: 'center'
    },
    qrContainer: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '16px',
      padding: '24px',
      marginTop: '1rem',
      textAlign: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    },
    qrTitle: {
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#1a1a1a',
      marginBottom: '1rem'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px dashed #e5e7eb',
      fontSize: '0.95rem',
      color: '#374151'
    },
    confirmBtn: {
      marginTop: '1.5rem',
      width: '100%',
      padding: '14px',
      background: '#1a1a1a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.2s'
    },
    backBtn: {
      marginBottom: '1rem',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#374151',
      cursor: 'pointer',
      display: 'inline-block'
    }
  };

  const isInfoComplete = form.fullName.trim() !== '' && form.phone.trim() !== '' && form.address.trim() !== '';

  return (
    <div className="checkout-page-bg">
      <CheckoutToast toast={toast} />

      <div className="checkout-content">
        <h1 className="checkout-title">THANH TOÁN</h1>

        {cartItems.some(i => i.isPreOrder) && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fff7ed)',
            border: '1px solid #f59e0b',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#92400e',
            fontWeight: '600'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <span>Lưu ý: Đơn hàng của bạn có chứa Sản phẩm Đặt trước (Pre-order).</span>
          </div>
        )}

        <div className="checkout-form">
          {checkoutStep === 1 && (
            <>
              {/* ── Delivery Info ── */}
              <div className="checkout-section-label">📦 Bước 1: Thông tin giao hàng</div>
              
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa chỉ giao hàng</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ── Payment Categories ── */}
              <div className="checkout-section-label" style={{ marginTop: '24px' }}>💳 Phương thức thanh toán</div>
              
              {!isInfoComplete && (
                <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️</span> <i>Vui lòng điền đủ thông tin giao hàng trước để hiện phương thức thanh toán</i>
                </div>
              )}

              <div className="checkout-payment-options" style={{ display: 'flex', opacity: isInfoComplete ? 1 : 0.4, pointerEvents: isInfoComplete ? 'auto' : 'none', transition: 'opacity 0.3s ease' }}>
                <label className={`payment-option ${form.paymentType === 'COD' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentType"
                    value="COD"
                    checked={form.paymentType === 'COD'}
                    onChange={handleChange}
                  />
                  <span className="payment-option-icon">💵</span>
                  <div>
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span>Trả tiền mặt khi Shipper giao hàng tới</span>
                  </div>
                </label>

                <label className={`payment-option ${form.paymentType === 'ONLINE' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentType"
                    value="ONLINE"
                    checked={form.paymentType === 'ONLINE'}
                    onChange={handleChange}
                  />
                  <span className="payment-option-icon">📱</span>
                  <div>
                    <strong>Thanh toán chuyển khoản / Ví ĐT</strong>
                    <span>Quét mã QR tự động bằng App ngân hàng</span>
                  </div>
                </label>
              </div>

              <button 
                type="button" 
                onClick={handleNextStep} 
                className="place-order-btn" 
                style={{ marginTop: '24px', opacity: isInfoComplete ? 1 : 0.6, cursor: isInfoComplete ? 'pointer' : 'not-allowed' }}
              >
                TIẾP TỤC
              </button>
            </>
          )}

          {/* ── QR Code View (Step 3) ── */}
          {checkoutStep === 3 && selectedMethod && (
            <div style={inlineStyles.qrContainer}>
              <h2 style={inlineStyles.qrTitle}>Bước 3: Quét mã QR thanh toán</h2>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                {/* QR Container */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', width: '100%', maxWidth: '480px' }}>
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <img src={qrData} alt="VietQR" style={{ width: '100%', maxWidth: '400px', height: 'auto', objectFit: 'contain', borderRadius: '8px', display: 'block' }} />
                  </div>
                  <div style={{ fontSize: '1.1rem', color: '#1a1a1a', fontWeight: '500', textAlign: 'center', marginTop: '16px' }}>
                    Quét bằng app ngân hàng hoặc ví bất kỳ
                  </div>
                </div>
              </div>

               {/* Bottom section: Order info */}
               <div style={{ textAlign: 'left', background: '#f9fafb', padding: '24px', borderRadius: '12px', marginTop: '16px', border: '1px solid #e5e7eb' }}>
                 <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', color: '#1a1a1a' }}>Thông tin đơn hàng</h3>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '0.95rem' }}>
                   <div>
                     <span style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Khách hàng</span>
                     <strong style={{ color: '#1a1a1a' }}>{form.fullName}</strong>
                   </div>
                   <div>
                     <span style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Số điện thoại</span>
                     <strong style={{ color: '#1a1a1a' }}>{form.phone}</strong>
                   </div>
                   <div>
                     <span style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Mã đơn hàng</span>
                     <strong style={{ color: '#2563eb' }}>#{pendingOrderId}</strong>
                   </div>
                   <div style={{ gridColumn: '1 / -1' }}>
                     <span style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Địa chỉ giao hàng</span>
                     <strong style={{ color: '#1a1a1a' }}>{form.address}</strong>
                   </div>
                   <div style={{ gridColumn: '1 / -1' }}>
                     <span style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Danh sách sản phẩm</span>
                     <ul style={{ margin: 0, paddingLeft: '20px', color: '#1a1a1a' }}>
                       {cartItems.map((item, idx) => (
                         <li key={item.id || idx} style={{ marginBottom: '4px' }}>
                           {item.name} <em style={{ color: '#374151', fontStyle: 'normal' }}>x {item.quantity}</em>
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #e5e7eb', paddingTop: '12px', marginTop: '4px' }}>
                     <span style={{ color: '#374151', display: 'inline-block', marginRight: '8px' }}>Tổng tiền:</span>
                     <strong style={{ color: '#dc2626', fontSize: '1.1rem' }}>{finalTotal.toLocaleString('vi-VN')} ₫</strong>
                   </div>
                 </div>
               </div>

              <button 
                style={inlineStyles.confirmBtn}
                onClick={handleFinalizeOnlineOrder}
                onMouseOver={e => e.target.style.background = '#2563eb'}
                onMouseOut={e => e.target.style.background = '#1a1a1a'}
              >
                TÔI ĐÃ THANH TOÁN
              </button>
            </div>
          )}
          
          {/* Order Summary Form (Step 2) */}
          {checkoutStep === 2 && (
            <>
              <button 
                type="button" 
                style={inlineStyles.backBtn} 
                onClick={() => setCheckoutStep(1)}
              >
                ← Quay lại
              </button>

              <div className="checkout-summary" style={{ marginTop: '1rem' }}>
                <h3>Bước 2: Tóm tắt đơn hàng</h3>
                {cartItems.length === 0 ? (
                  <p style={{ color: 'var(--text-light, #666)', textAlign: 'center', padding: '1rem 0' }}>
                    Giỏ hàng đang trống
                  </p>
                ) : (
                  <div className="checkout-items-list">
                    {cartItems.map((item) => (
                      <div key={item.id} className="checkout-item-row">
                        <span className="checkout-item-name">
                          {item.name}
                          <em> × {item.quantity}</em>
                        </span>
                        <span className="checkout-item-price">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="checkout-voucher-section" style={{ margin: '16px 0', display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá..." 
                    value={voucherCode} 
                    onChange={e => setVoucherCode(e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px' }}
                    disabled={appliedVoucher != null}
                  />
                  {appliedVoucher ? (
                    <button style={{ padding: '10px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => { setAppliedVoucher(null); setDiscountAmount(0); setVoucherCode(''); }}>Gỡ mã</button>
                  ) : (
                    <button style={{ padding: '10px 16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={handleApplyVoucher}>Áp dụng</button>
                  )}
                </div>

                <div className="checkout-pricing-rows" style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                    <span>Tạm tính</span>
                    <span>{cartTotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 'bold' }}>
                      <span>Giảm giá ({appliedVoucher?.code})</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}
                  <p className="checkout-total" style={{ borderTop: 'none', padding: '16px 0 0', margin: 0 }}>
                    Tổng tiền
                    <span style={{ color: '#dc2626' }}>{finalTotal.toLocaleString('vi-VN')} ₫</span>
                  </p>
                </div>
              </div>

              <button type="submit" onClick={handlePlaceOrder} className="place-order-btn" disabled={loading || cartItems.length === 0} style={{ marginTop: '16px' }}>
                {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;