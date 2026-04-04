import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminTable.css';

const API_BASE = 'http://localhost:5130';

const STATUS_FLOW = ['Pending', 'Confirmed', 'Shipping', 'Delivered'];
const STATUS_LABELS = {
  'Pending': 'Chờ xác nhận', 'Chờ xác nhận': 'Chờ xác nhận',
  'Confirmed': 'Đã xác nhận', 'Chờ thanh toán': 'Chờ thanh toán',
  'Shipping': 'Đang giao', 'Đang giao': 'Đang giao',
  'Delivered': 'Đã giao', 'Đã giao': 'Đã giao',
  'Cancelled': 'Đã hủy', 'Đã hủy': 'Đã hủy',
  'Đã thanh toán': 'Đã thanh toán', 'Đang xử lý order': 'Đang xử lý order'
};
const STATUS_BADGE = {
  'Pending':'badge-pending','Chờ xác nhận':'badge-pending','Chờ thanh toán':'badge-pending',
  'Confirmed':'badge-confirmed','Đã thanh toán':'badge-confirmed',
  'Shipping':'badge-shipping','Đang giao':'badge-shipping','Đang xử lý order':'badge-shipping',
  'Delivered':'badge-delivered','Đã giao':'badge-delivered',
  'Cancelled':'badge-cancelled','Đã hủy':'badge-cancelled'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, { headers });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Lỗi cập nhật trạng thái');
      fetchOrders();
      showAlert('success', `Cập nhật đơn #${orderId} → ${newStatus}`);
    } catch (err) { showAlert('error', err.message); }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm(`Hủy đơn hàng #${id}?`)) return;
    await updateStatus(id, 'Cancelled');
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const filtered = orders.filter(o => {
    const matchSearch = (o.fullName || '').toLowerCase().includes(search.toLowerCase()) || String(o.id).includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => ['Pending','Chờ xác nhận','Chờ thanh toán'].includes(o.status)).length,
    shipping: orders.filter(o => ['Shipping','Đang giao','Đang xử lý order'].includes(o.status)).length,
    delivered: orders.filter(o => ['Delivered','Đã giao'].includes(o.status)).length,
  };

  return (
    <div className="admin-table-page">
      <div className="admin-page-header">
        <div>
          <h1>🛒 Quản lý Đơn hàng</h1>
          <p className="page-subtitle">Cập nhật trạng thái và theo dõi toàn bộ đơn hàng</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/dashboard" className="admin-back-btn">← Dashboard</Link>
        </div>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card"><span className="admin-stat-icon">📋</span><div className="admin-stat-info"><h3>Tổng đơn</h3><p>{stats.total}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">⏳</span><div className="admin-stat-info"><h3>Chờ xử lý</h3><p>{stats.pending}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">🚚</span><div className="admin-stat-info"><h3>Đang giao</h3><p>{stats.shipping}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">✅</span><div className="admin-stat-info"><h3>Đã giao</h3><p>{stats.delivered}</p></div></div>
      </div>

      {alert.msg && <div className={alert.type==='success'?'alert-success':'alert-error'}>{alert.msg}</div>}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <input className="admin-search-input" placeholder="Tìm theo tên khách hoặc ID..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="Pending">Chờ xác nhận</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Shipping">Đang giao</option>
            <option value="Delivered">Đã giao</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
        </div>

        {loading ? (
          <div className="table-loading">⏳ Đang tải đơn hàng...</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty"><span className="table-empty-icon">📭</span><p>Không có đơn hàng nào.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Đơn #</th>
                <th>Khách hàng</th>
                <th>Địa chỉ</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const next = getNextStatus(o.status);
                const canCancel = !['Delivered','Đã giao','Cancelled','Đã hủy'].includes(o.status);
                return (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>
                      <div><strong>{o.fullName}</strong></div>
                      <div style={{ fontSize:'0.78rem', color:'#64748b' }}>{o.phoneNumber}</div>
                    </td>
                    <td style={{ maxWidth: 160, fontSize:'0.82rem' }}>{o.shippingAddress}</td>
                    <td style={{ fontSize:'0.82rem' }}>{o.paymentMethod || '—'}</td>
                    <td style={{ fontWeight:700, color:'#dc2626', whiteSpace:'nowrap' }}>
                      {Number(o.totalPrice).toLocaleString('vi-VN')} ₫
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[o.status] || 'badge-pending'}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td style={{ fontSize:'0.8rem', color:'#64748b', whiteSpace:'nowrap' }}>
                      {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <div className="action-btns">
                        {next && (
                          <button className={`btn-sm ${next==='Confirmed'?'btn-confirm':next==='Shipping'?'btn-ship':'btn-deliver'}`}
                            onClick={() => updateStatus(o.id, next)}>
                            {next==='Confirmed'?'✅ Xác nhận':next==='Shipping'?'🚚 Giao hàng':'📦 Đã giao'}
                          </button>
                        )}
                        {canCancel && (
                          <button className="btn-sm btn-cancel" onClick={() => cancelOrder(o.id)}>❌ Hủy</button>
                        )}
                        <button className="btn-sm btn-view" onClick={() => setSelectedOrder(o)}>👁 Chi tiết</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelectedOrder(null)}>
          <div className="modal-box">
            <h3>📋 Chi tiết đơn #{selectedOrder.id}</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px', marginBottom:'1rem' }}>
              <div><strong>Khách hàng:</strong> {selectedOrder.fullName}</div>
              <div><strong>SĐT:</strong> {selectedOrder.phoneNumber}</div>
              <div style={{ gridColumn:'1/-1' }}><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</div>
              <div><strong>Thanh toán:</strong> {selectedOrder.paymentMethod}</div>
              <div><strong>Tổng tiền:</strong> <span style={{ color:'#dc2626', fontWeight:700 }}>{Number(selectedOrder.totalPrice).toLocaleString('vi-VN')} ₫</span></div>
            </div>
            <strong>Sản phẩm:</strong>
            <div style={{ marginTop:'8px', background:'#f8fafc', borderRadius:8, padding:'8px', maxHeight:200, overflowY:'auto' }}>
              {(selectedOrder.orderItems || []).map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #e2e8f0', fontSize:'0.85rem' }}>
                  <span>{item.product?.name || `SID ${item.productId}`} × {item.quantity}</span>
                  <span style={{ fontWeight:600 }}>{Number(item.price*item.quantity).toLocaleString('vi-VN')} ₫</span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={()=>setSelectedOrder(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
