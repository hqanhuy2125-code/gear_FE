import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminDashboard.css';

const API_BASE = 'http://localhost:5130';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/admin-stats`, { headers });
        if (res.ok) setStats(await res.json());
      } catch { } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const navCards = [
    { icon: '📦', title: 'Quản lý Sản phẩm', desc: 'Thêm/sửa/xóa sản phẩm, cập nhật tồn kho', link: '/admin/products', label: 'Đến trang Sản phẩm' },
    { icon: '🛒', title: 'Quản lý Đơn hàng', desc: 'Xem và cập nhật trạng thái tất cả đơn hàng', link: '/admin/orders', label: 'Đến trang Đơn hàng' },
    { icon: '👥', title: 'Quản lý Người dùng', desc: 'Xem danh sách, khóa/mở khóa tài khoản', link: '/admin/users', label: 'Đến trang Người dùng' },
  ];

  return (
    <div className="admin-dashboard-bg">
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <div className="admin-badge">ADMIN</div>
          <h1 className="admin-dashboard-title">Dashboard</h1>
          <p className="admin-dashboard-subtitle">
            Chào mừng trở lại, <strong>{user?.name}</strong>! Quản lý cửa hàng của bạn tại đây.
          </p>
        </div>

        {/* STATS */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🛒</span>
            <span className="admin-stat-label">Tổng đơn hàng</span>
            <span className="admin-stat-value">{loading ? '...' : stats?.totalOrders ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">⏳</span>
            <span className="admin-stat-label">Chờ xử lý</span>
            <span className="admin-stat-value">{loading ? '...' : stats?.pendingOrders ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">📦</span>
            <span className="admin-stat-label">Sản phẩm</span>
            <span className="admin-stat-value">{loading ? '...' : stats?.totalProducts ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>
            <span className="admin-stat-label">Khách hàng</span>
            <span className="admin-stat-value">{loading ? '...' : stats?.totalUsers ?? '—'}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">💰</span>
            <span className="admin-stat-label">Doanh thu (đã giao)</span>
            <span className="admin-stat-value" style={{ fontSize: '0.9rem' }}>
              {loading ? '...' : stats?.totalRevenue ? `${Number(stats.totalRevenue).toLocaleString('vi-VN')} ₫` : '—'}
            </span>
          </div>
        </div>

        {/* NAV CARDS */}
        <div className="admin-cards-grid" style={{ marginTop: '2rem' }}>
          {navCards.map((card) => (
            <div key={card.title} className="admin-nav-card">
              <span className="admin-nav-icon">{card.icon}</span>
              <h3 className="admin-nav-title">{card.title}</h3>
              <p className="admin-nav-desc">{card.desc}</p>
              <Link to={card.link} className="admin-nav-btn">{card.label} →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
