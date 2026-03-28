import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'http://localhost:5130';

const VnPayReturn = () => {
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('Đang xử lý kết quả thanh toán. Vui lòng đợi...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('vnp_ResponseCode')) {
      setStatus('error');
      setMessage('Không tìm thấy thông tin giao dịch VNPay hợp lệ.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const query = location.search;
        const res = await fetch(`${API_BASE}/api/payment/vnpay-return${query}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage('Thanh toán thành công! Cảm ơn bạn đã mua sắm.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Thanh toán thất bại hoặc bị hủy.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Lỗi kết nối máy chủ khi xác thực thanh toán.');
      }
    };

    verifyPayment();
  }, [location.search]);

  return (
    <div className="container" style={{ padding: '6rem 1.5rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        boxShadow: '0 20px 48px rgba(0,0,0,0.1)'
      }}>
        {status === 'processing' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto',
              border: '4px solid #f3f4f6', borderTopColor: '#3b82f6',
              borderRadius: '50%', animation: 'loginSpin .8s linear infinite'
            }}></div>
          </div>
        )}

        {status === 'success' && (
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        )}

        {status === 'error' && (
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        )}

        <h2 style={{
          color: status === 'success' ? '#166534' : status === 'error' ? '#991b1b' : '#1f2937',
          fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem'
        }}>
          {status === 'processing' ? 'Đang xác thực giao dịch' : status === 'success' ? 'Thanh toán hoàn tất' : 'Giao dịch không thành công'}
        </h2>

        <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          {message}
        </p>

        <button
          onClick={() => navigate('/orders')}
          style={{
            background: '#111', color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: '100px', fontSize: '0.9rem',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%'
          }}
          onMouseOver={(e) => e.target.style.background = '#333'}
          onMouseOut={(e) => e.target.style.background = '#111'}
        >
          QUẢN LÝ ĐƠN HÀNG
        </button>
      </div>
    </div>
  );
};

export default VnPayReturn;
