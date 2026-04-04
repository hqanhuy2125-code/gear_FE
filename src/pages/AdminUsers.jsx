import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/AdminTable.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
  };

  const handleBlock = async (id, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block';
    try {
      await api.put(`/api/users/${id}/${action}`);
      fetchUsers();
      showAlert('success', isBlocked ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản.');
    } catch (err) { showAlert('error', err.response?.data?.message || 'Lỗi cập nhật trạng thái'); }
  };

  const viewHistory = async (user) => {
    setSelectedUser(user);
    setLoadingOrders(true);
    try {
      const { data: allOrders } = await api.get('/api/orders');
      setUserOrders(Array.isArray(allOrders) ? allOrders.filter(o => o.userId === user.id) : []);
    } catch { setUserOrders([]); } finally { setLoadingOrders(false); }
  };

  const filtered = users.filter(u => {
    const nameMatch = u.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(search.toLowerCase());
    const matchSearch = nameMatch || emailMatch;
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    customers: users.filter(u=>u.role==='customer').length,
    admins: users.filter(u=>u.role==='admin'||u.role==='admin_blocked').length,
    blocked: users.filter(u=>u.role==='admin_blocked').length,
  };

  const getRoleBadge = (role) => {
    if (role === 'owner') return <span className="badge badge-confirmed">Owner</span>;
    if (role === 'admin') return <span className="badge badge-shipping">Admin</span>;
    if (role === 'admin_blocked') return <span className="badge badge-blocked">Admin (Bị khóa)</span>;
    return <span className="badge badge-active">Customer</span>;
  };

  return (
    <div className="admin-table-page">
      <div className="admin-page-header">
        <div>
          <h1>👥 Quản lý Người dùng</h1>
          <p className="page-subtitle">Xem danh sách, khóa/mở khóa và theo dõi hoạt động người dùng</p>
        </div>
        <Link to="/admin/dashboard" className="admin-back-btn">← Dashboard</Link>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card"><span className="admin-stat-icon">👤</span><div className="admin-stat-info"><h3>Tổng user</h3><p>{stats.total}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">🛒</span><div className="admin-stat-info"><h3>Khách hàng</h3><p>{stats.customers}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">🔧</span><div className="admin-stat-info"><h3>Admin</h3><p>{stats.admins}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">🔒</span><div className="admin-stat-info"><h3>Bị khóa</h3><p>{stats.blocked}</p></div></div>
      </div>

      {alert.msg && <div className={alert.type==='success'?'alert-success':'alert-error'}>{alert.msg}</div>}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <input className="admin-search-input" placeholder="Tìm theo tên hoặc email..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="admin_blocked">Admin (Bị khóa)</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        {loading ? (
          <div className="table-loading">⏳ Đang tải danh sách người dùng...</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty"><span className="table-empty-icon">👤</span><p>Không có người dùng nào.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isBlocked = u.role === 'admin_blocked';
                const canBlock = u.role === 'admin' || u.role === 'admin_blocked';
                return (
                  <tr key={u.id}>
                    <td><strong>#{u.id}</strong></td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#60a5fa)', display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.9rem',flexShrink:0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td style={{ fontSize:'0.8rem', color:'#64748b' }}>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="action-btns">
                        {u.role === 'customer' && (
                          <button className="btn-sm btn-view" onClick={() => viewHistory(u)}>📋 Lịch sử mua</button>
                        )}
                        {canBlock && (
                          <button className={`btn-sm ${isBlocked ? 'btn-unblock' : 'btn-block'}`}
                            onClick={() => handleBlock(u.id, isBlocked)}>
                            {isBlocked ? '🔓 Mở khóa' : '🔒 Khóa'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Purchase History Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelectedUser(null)}>
          <div className="modal-box">
            <h3>📋 Lịch sử mua hàng — {selectedUser.name}</h3>
            <p style={{ color:'#64748b', fontSize:'0.85rem', marginBottom:'1rem' }}>{selectedUser.email}</p>
            {loadingOrders ? (
              <p>Đang tải...</p>
            ) : userOrders.length === 0 ? (
              <div className="table-empty"><span className="table-empty-icon">🛒</span><p>Chưa có đơn hàng nào.</p></div>
            ) : (
              <div className="order-history-panel">
                {userOrders.map(o => (
                  <div key={o.id} className="order-history-item">
                    <div>
                      <strong>#{o.id}</strong>
                      <span style={{ marginLeft:8, fontSize:'0.78rem', color:'#64748b' }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontWeight:700, color:'#dc2626', fontSize:'0.85rem' }}>{Number(o.totalPrice).toLocaleString('vi-VN')} ₫</span>
                      <span className={`badge ${o.status==='Delivered'||o.status==='Đã giao'?'badge-delivered':o.status==='Cancelled'||o.status==='Đã hủy'?'badge-cancelled':'badge-pending'}`} style={{ fontSize:'0.68rem' }}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop:'1rem', fontWeight:700, color:'#1e293b' }}>
              Tổng: {userOrders.length} đơn — {Number(userOrders.reduce((sum,o)=>sum+o.totalPrice,0)).toLocaleString('vi-VN')} ₫
            </div>
            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={()=>setSelectedUser(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
