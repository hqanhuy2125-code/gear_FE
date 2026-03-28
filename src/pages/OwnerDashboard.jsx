import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Loader2, AlertCircle, TrendingUp, ShoppingBag, Box, Users } from 'lucide-react';
import '../styles/OwnerDashboard.css';

const API_BASE = 'http://localhost:5130';

const OwnerDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard Stats State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  // Admin Mgmt State
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [adminError, setAdminError] = useState('');

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        const errData = await res.json();
        setStatsError(errData.message || 'Không thể tải thống kê hệ thống');
      }
    } catch (err) {
      setStatsError('Lỗi kết nối đến máy chủ thống kê');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      if (res.ok) {
        const data = await res.json();
        const adminUsers = data
          .filter(u => u.role === 'admin' || u.role === 'admin_blocked')
          .map(u => ({ ...u, isBlocked: u.role === 'admin_blocked' }));
        setAdmins(adminUsers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    setAdminError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAdmin, role: 'admin' }),
      });
      if (res.ok) {
        setNewAdmin({ name: '', email: '', password: '' });
        fetchAdmins();
        fetchStats(); // Update total users count
      } else {
        const data = await res.json();
        setAdminError(data.message || 'Lỗi tạo admin');
      }
    } catch (err) {
      setAdminError('Lỗi kết nối máy chủ');
    }
  };

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      const endpoint = isBlocked ? 'unblock' : 'block';
      const res = await fetch(`${API_BASE}/api/users/${id}/${endpoint}`, { method: 'PUT' });
      if (res.ok) {
        fetchAdmins();
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingStats && !stats) {
    return (
      <div className="owner-dashboard-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Đang tải dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard-container">
      <div className="owner-header">
        <h1>OWNER DASHBOARD</h1>
        <p>Tổng quan hệ thống SCYTOL CLX21 — Xin chào, <strong>{user?.name}</strong>!</p>
      </div>

      {statsError && (
        <div className="owner-stats-error">
          <AlertCircle size={20} />
          {statsError}
          <button onClick={fetchStats}>Thử lại</button>
        </div>
      )}

      {/* STATS OVERVIEW */}
      <div className="owner-stats-grid">
        <div className="owner-stat-card">
          <div className="stat-icon-wrapper revenue"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <h3>Tổng Doanh Thu</h3>
            <p className="owner-stat-value">{(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫</p>
          </div>
        </div>
        <div className="owner-stat-card">
          <div className="stat-icon-wrapper orders"><ShoppingBag size={24} /></div>
          <div className="stat-info">
            <h3>Tổng Đơn Hàng</h3>
            <p className="owner-stat-value">{stats?.totalOrders || 0}</p>
          </div>
        </div>
        <div className="owner-stat-card">
          <div className="stat-icon-wrapper products"><Box size={24} /></div>
          <div className="stat-info">
            <h3>Tổng Sản Phẩm</h3>
            <p className="owner-stat-value">{stats?.totalProducts || 0}</p>
          </div>
        </div>
        <div className="owner-stat-card">
          <div className="stat-icon-wrapper users"><Users size={24} /></div>
          <div className="stat-info">
            <h3>Tổng Thành Viên</h3>
            <p className="owner-stat-value">{stats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      <div className="owner-main-grid">
        {/* REVENUE CHART */}
        <div className="owner-chart-section">
          <h2>Biểu đồ Doanh Thu Năm {new Date().getFullYear()}</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={stats?.resvenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v/1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(v) => [ `${v.toLocaleString('vi-VN')} ₫`, 'Doanh thu' ]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Doanh thu" 
                  stroke="#fbbf24" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#fbbf24', strokeWidth: 2, stroke: '#1e293b' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REVENUE SUMMARY */}
        <div className="owner-revenue-summary">
          <h2>Tóm tắt Tháng Hiện Tại</h2>
          <div className="summary-card">
             <div className="summary-item">
                <span>Tháng này</span>
                <strong>{stats?.resvenueByMonth?.[new Date().getMonth()]?.revenue?.toLocaleString('vi-VN')} ₫</strong>
             </div>
             <p className="summary-note">* Chỉ tính các đơn hàng đã giao thành công.</p>
          </div>

          {/* NEW ANALYTICS CARD */}
          <div className="summary-card" style={{ marginTop: '20px' }}>
            <div className="top-products-section">
              <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Top 3 Sản Phẩm Bán Chạy (Tháng này)
              </h4>
              <div className="top-products-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats?.topProducts?.length > 0 ? (
                  stats.topProducts.map((p, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '10px 15px', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>#{i+1}</span>
                        <span style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{p.sales}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '10px' }}>Chưa có dữ liệu bán hàng tháng này.</p>
                )}
              </div>
            </div>

            <div className="order-status-section" style={{ marginTop: '25px' }}>
              <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Trạng Thái Đơn Hàng
              </h4>
              <div className="status-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Chờ xác nhận', count: stats?.orderStatusCounts?.pending || 0, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.1)' },
                  { label: 'Đang giao', count: stats?.orderStatusCounts?.shipping || 0, color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.1)' },
                  { label: 'Đã giao', count: stats?.orderStatusCounts?.delivered || 0, color: '#4ade80', bg: 'rgba(34, 197, 94, 0.1)' }
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, padding: '12px 8px', borderRadius: '10px', textAlign: 'center', border: `1px solid ${s.bg}` }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: s.color, marginBottom: '4px' }}>{s.count}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.2' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN MANAGEMENT */}
      <div className="owner-admin-mgmt">
        <div className="section-header">
           <h2>Tài Khoản Quản Trị Viên (Admin)</h2>
           <span className="admin-count">{admins.length} nhân sự</span>
        </div>
        
        {adminError && <div className="owner-error-alert">{adminError}</div>}
        
        <form className="admin-create-form" onSubmit={handleCreateAdmin}>
          <div className="form-inputs">
            <input 
              type="text" 
              placeholder="Tên đầy đủ" 
              value={newAdmin.name} 
              onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
              required 
            />
            <input 
              type="email" 
              placeholder="Email đăng nhập" 
              value={newAdmin.email} 
              onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
              required 
            />
            <input 
              type="password" 
              placeholder="Mật khẩu tạm thời" 
              value={newAdmin.password} 
              onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="btn-create-admin">Thêm Nhân Sự</button>
        </form>

        <div className="admin-list">
          {loadingAdmins ? <div className="loading-small"><Loader2 className="animate-spin" /> Đang tải danh sách...</div> : admins.length === 0 ? <p className="empty-msg">Chưa có tài khoản admin nào được tạo.</p> : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Liên hệ</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td className="admin-name-cell">
                        <div className="admin-avatar">{admin.name.charAt(0)}</div>
                        {admin.name}
                      </td>
                      <td>{admin.email}</td>
                      <td>
                        <span className={`status-pill ${admin.isBlocked ? 'blocked' : 'active'}`}>
                          {admin.isBlocked ? 'Vô hiệu hóa' : 'Đang làm việc'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`btn-action ${admin.isBlocked ? 'unblock' : 'block'}`}
                          onClick={() => handleToggleBlock(admin.id, admin.isBlocked)}
                        >
                          {admin.isBlocked ? 'Kích hoạt lại' : 'Tạm đình chỉ'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
