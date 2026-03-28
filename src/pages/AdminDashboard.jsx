import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/orders');
        // Chỉ lấy các đơn đang chờ thanh toán
        setPendingOrders(data.filter(o => o.status === 'Chờ thanh toán'));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchPending();
  }, [user]);

  const handleConfirmPayment = async (orderId) => {
    if (!window.confirm(`Xác nhận đã nhận tiền cho đơn hàng #${orderId}?`)) return;
    try {
      await api.put(`/api/orders/${orderId}/confirm-payment`);
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      alert('Đã xác nhận thanh toán thành công!');
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || 'Không thể xác nhận.'));
    }
  };

  const cards = [
    {
      icon: '📦',
      title: 'Quản lý Sản phẩm',
      desc: 'Kho hàng, Đặt trước & Made to Order',
      link: '/keyboards',
      label: 'Xem sản phẩm',
    },
    {
      icon: '🛒',
      title: 'Quản lý Đơn hàng',
      desc: 'Xem và cập nhật trạng thái tất cả đơn hàng',
      link: '/admin/orders',
      label: 'Xem đơn hàng',
    },
    {
      icon: '👥',
      title: 'Quản lý Người dùng',
      desc: 'Xem danh sách và quản lý tài khoản người dùng',
      link: '/admin/users',
      label: 'Xem người dùng',
    },
  ];

  return (
    <div className="admin-dashboard-bg">
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div className="admin-badge">ADMIN</div>
          <h1 className="admin-dashboard-title">
            Dashboard
          </h1>
          <p className="admin-dashboard-subtitle">
            Chào mừng trở lại, <strong>{user?.name}</strong>! Quản lý cửa hàng của bạn tại đây.
          </p>
        </div>

        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🛒</span>
            <span className="admin-stat-label">Đơn hàng hôm nay</span>
            <span className="admin-stat-value">—</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">📦</span>
            <span className="admin-stat-label">Sản phẩm</span>
            <span className="admin-stat-value">—</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>
            <span className="admin-stat-label">Người dùng</span>
            <span className="admin-stat-value">—</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">💰</span>
            <span className="admin-stat-label">Doanh thu</span>
            <span className="admin-stat-value">—</span>
          </div>
        </div>

        {/* SECTION: PENDING PAYMENTS */}
        <div className="admin-section" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1e293b' }}>⏳ Chờ thanh toán ({pendingOrders.length})</h2>
          {loading ? <p>Đang tải...</p> : pendingOrders.length === 0 ? (
            <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
              Không có đơn hàng nào đang chờ xác nhận tiền.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pendingOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div>
                    <strong>#{order.id}</strong> - {order.fullName}
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Tổng tiền: <span style={{ color: '#dc2626', fontWeight: '700' }}>{order.totalPrice.toLocaleString('vi-VN')} ₫</span> | {order.paymentMethod}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConfirmPayment(order.id)}
                    style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                  >
                    ✅ Xác nhận đã nhận tiền
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-cards-grid" style={{ marginTop: '2rem' }}>
          {cards.map((card) => (
            <div key={card.title} className="admin-nav-card">
              <span className="admin-nav-icon">{card.icon}</span>
              <h3 className="admin-nav-title">{card.title}</h3>
              <p className="admin-nav-desc">{card.desc}</p>
              <Link to={card.link} className="admin-nav-btn">
                {card.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
