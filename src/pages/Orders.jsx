import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import api from '../api';
import '../styles/Account.css';
import '../styles/Orders.css';

/* ── Tiny toast util ── */
const OrderToast = ({ toast }) => {
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

/* ── Status badge ── */
const STATUS_MAP = {
  Pending:   { label: '🔵 Chờ xác nhận', cls: 'status-pending' },
  'Chờ xác nhận': { label: '🔵 Chờ xác nhận', cls: 'status-pending' },
  'Chờ thanh toán': { label: '⏳ Chờ thanh toán', cls: 'status-waiting' },
  'Đã thanh toán': { label: '✅ Đã thanh toán', cls: 'status-paid' },
  Paid:           { label: '✅ Đã thanh toán', cls: 'status-paid' },
  Confirmed: { label: '✅ Đã xác nhận', cls: 'status-paid' },
  'Đã xác nhận': { label: '✅ Đã xác nhận', cls: 'status-paid' },
  Shipping:  { label: '🚚 Đang giao',    cls: 'status-shipping' },
  Delivered: { label: '✔️ Đã giao',   cls: 'status-delivered' },
  Completed: { label: '✔️ Đã giao',   cls: 'status-delivered' },
  Cancelled: { label: '❌ Đã hủy',       cls: 'status-cancelled' },
  'Đã hủy':  { label: '❌ Đã hủy',       cls: 'status-cancelled' },
};

const StatusBadge = ({ status }) => {
  const info = STATUS_MAP[status] || { label: status, cls: 'status-pending' };
  return <span className={`order-status-badge ${info.cls}`}>{info.label}</span>;
};

const formatCurrency = (v) => `${Number(v).toLocaleString('vi-VN')} ₫`;

const formatDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
};

/* ── Order Timeline (User) ── */
const OrderTimeline = ({ order }) => {
  const steps = [
    { label: 'Đặt hàng', time: order.createdAt, status: 'Completed' },
    { 
      label: 'Thanh toán', 
      time: (order.status === 'Paid' || order.status === 'Đã thanh toán' || order.status === 'Confirmed' || order.status === 'Shipping' || order.status === 'Delivered') ? (order.paidAt || order.createdAt) : (order.status === 'Cancelled' || order.status === 'Đã hủy') ? order.cancelledAt : null, 
      status: (order.status === 'Paid' || order.status === 'Đã thanh toán' || order.status === 'Confirmed' || order.status === 'Shipping' || order.status === 'Delivered') 
        ? 'Completed' 
        : (order.status === 'Cancelled' || order.status === 'Đã hủy') 
          ? 'Cancelled' 
          : (order.status === 'Chờ thanh toán' ? 'Active' : 'Pending') 
    },
    { label: 'Xác nhận', time: order.confirmedAt, status: order.status === 'Confirmed' ? 'Active' : (order.confirmedAt ? 'Completed' : 'Pending') },
    { label: 'Đang giao', time: order.shippingAt, status: order.status === 'Shipping' ? 'Active' : (order.shippingAt ? 'Completed' : 'Pending') },
    { label: 'Đã giao', time: order.deliveredAt, status: order.status === 'Delivered' ? 'Completed' : 'Pending' }
  ];

  if (order.status === 'Cancelled') {
    steps.push({ label: 'Đã hủy', time: order.cancelledAt, status: 'Cancelled' });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px', background: '#f8fafc', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
      {steps.map((st, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
          {/* Connector Line */}
          {i < steps.length - 1 && (
            <div style={{ position: 'absolute', top: 12, left: '50%', right: '-50%', height: 2, background: st.status === 'Completed' || st.status === 'Active' ? '#22c55e' : '#cbd5e1', zIndex: 1, transition: 'all 0.3s' }} />
          )}
          
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: st.status === 'Completed' ? '#22c55e' : (st.status === 'Active' ? '#3b82f6' : (st.status === 'Cancelled' ? '#ef4444' : '#e2e8f0')), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', position: 'relative', zIndex: 2, boxShadow: st.status === 'Active' ? '0 0 0 4px rgba(59,130,246,0.2)' : 'none' }}>
            {st.status === 'Completed' ? '✓' : (st.status === 'Cancelled' ? '✕' : (i + 1))}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: st.status === 'Active' ? '700' : '500', color: st.status === 'Active' ? '#1e293b' : '#64748b' }}>
            {st.label}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
            {st.time ? formatDateTime(st.time) : '—'}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Spinner ── */
const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
    <div className="orders-spinner" />
  </div>
);

const Orders = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState(null);

  const isManageView = (user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner') && location.pathname.includes('/admin/orders');

  const showToast = (type, title, msg) => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const url = isManageView ? '/api/orders' : `/api/orders/user/${user.id}`;
      const { data } = await api.get(url);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // SignalR Connection
    let connection = null;
    if (user && !isManageView) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5130/hubs/order")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Connected to OrderHub");
                connection.invoke("JoinUserGroup", user.id);
            })
            .catch(err => console.error("SignalR logic error: ", err));

        connection.on("UpdateOrderStatus", (update) => {
            console.log("Real-time Status Update:", update);
            const { orderId, status } = update;
            
            setOrders(prev => prev.map(o => {
                if (o.id === orderId) {
                    const updatedTimeField = 
                      status === 'Paid' ? 'paidAt' :
                      status === 'Confirmed' ? 'confirmedAt' :
                      status === 'Shipping' ? 'shippingAt' : 
                      (status === 'Delivered' ? 'deliveredAt' : 'cancelledAt');
                    return { ...o, status, [updatedTimeField]: new Date().toISOString() };
                }
                return o;
            }));

            showToast('success', 'Cập nhật đơn hàng', `Đơn hàng #${orderId} vừa chuyển sang: ${STATUS_MAP[status]?.label || status}`);
        });
    }

    return () => {
        if (connection) connection.stop();
    };
  }, [user, isManageView]);

  const handleUpdateStatus = async (orderId, newStatus, confirmMsg, successLabel) => {
    if (!window.confirm(confirmMsg)) return;
    setCancellingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}`, { status: newStatus });
      
      const updatedTimeField = 
        newStatus === 'Confirmed' ? 'confirmedAt' :
        newStatus === 'Shipping' ? 'shippingAt' : 
        (newStatus === 'Delivered' ? 'deliveredAt' : 'cancelledAt');
      
      const now = new Date().toISOString();

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, [updatedTimeField]: now } : o))
      );
      showToast('success', 'Thành công', successLabel);
    } catch (err) {
      showToast('error', 'Lỗi cập nhật', err.response?.data?.message || 'Vui lòng thử lại.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleConfirmDelivered = async (orderId) => {
    setCancellingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}`, { status: 'Delivered' });
      const now = new Date().toISOString();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Delivered', deliveredAt: now } : o))
      );
      showToast('success', 'Thành công', 'Xác nhận giao hàng thành công');
    } catch (err) {
      showToast('error', 'Lỗi cập nhật', err.response?.data?.message || 'Vui lòng thử lại.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}`, { status: 'Confirmed' });
      const now = new Date().toISOString();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Confirmed', confirmedAt: now } : o))
      );
      showToast('success', 'Thành công', 'Xác nhận đơn hàng thành công');
    } catch (err) {
      showToast('error', 'Lỗi cập nhật', err.response?.data?.message || 'Vui lòng thử lại.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container account-page">
        <div className="account-card">
          <p className="account-text">Vui lòng đăng nhập để xem đơn hàng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container account-page">
      <OrderToast toast={toast} />

      <div className="account-card">
        <h1 className="account-title">{isManageView ? 'Quản lý Đơn hàng' : 'Đơn hàng của tôi'}</h1>

        {loading && <Spinner />}

        {!loading && error && (
          <div className="orders-error-box">⚠️ {error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="account-text">
            {isManageView ? 'Chưa có đơn hàng nào trên hệ thống.' : 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay hôm nay!'}
          </p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td><strong>#{order.id}</strong></td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td><strong>{formatCurrency(order.totalPrice)}</strong></td>
                      <td><StatusBadge status={order.status} /></td>
                      <td>
                        <div className="orders-action-group">
                          <button
                            type="button"
                            className="account-btn tertiary orders-view-btn"
                            onClick={() =>
                              setExpandedId((prev) => (prev === order.id ? null : order.id))
                            }
                          >
                            {expandedId === order.id ? 'Ẩn' : 'Chi tiết'}
                          </button>

                          {(order.status === 'Pending' || order.status === 'Chờ thanh toán') && !isManageView && (
                            <button
                              type="button"
                              className="orders-cancel-btn"
                              onClick={() => handleUpdateStatus(order.id, 'Cancelled', 'Bạn có chắc muốn hủy đơn hàng này không?', 'Đơn hàng đã được hủy thành công.')}
                              disabled={cancellingId === order.id}
                            >
                              {cancellingId === order.id ? (
                                <span className="orders-spinner-sm" />
                              ) : 'Hủy đơn'}
                            </button>
                          )}

                          {/* ADMIN/OWNER CONTROLS */}
                          {isManageView && order.status === 'Chờ thanh toán' && (
                            <>
                              <button
                                type="button"
                                className="orders-cancel-btn" style={{ background: '#16a34a', color: 'white', border: 'none' }}
                                onClick={async () => {
                                  if (!window.confirm(`Xác nhận thanh toán cho đơn #${order.id}?`)) return;
                                  setCancellingId(order.id);
                                  try {
                                    await api.put(`/api/orders/${order.id}/confirm-payment`);
                                    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'Đã thanh toán' } : o)));
                                    showToast('success', 'Thành công', 'Đã xác nhận thanh toán');
                                  } catch (err) {
                                    showToast('error', 'Lỗi', err.response?.data?.message || 'Vui lòng thử lại.');
                                  } finally {
                                    setCancellingId(null);
                                  }
                                }}
                                disabled={cancellingId === order.id}
                              >
                                Xác nhận thanh toán
                              </button>
                              <button
                                type="button"
                                className="orders-cancel-btn"
                                onClick={() => handleUpdateStatus(order.id, 'Cancelled', `Xác nhận hủy đơn #${order.id}?`, 'Đơn hàng đã bị hủy')}
                                disabled={cancellingId === order.id}
                              >
                                Hủy đơn
                              </button>
                            </>
                          )}

                          {isManageView && (order.status === 'Pending' || order.status === 'Đã thanh toán') && (
                            <>
                              <button
                                type="button"
                                className="orders-cancel-btn" style={{ background: '#2563eb', color: 'white', border: 'none' }}
                                onClick={() => handleUpdateStatus(order.id, 'Confirmed', `Xác nhận đơn #${order.id}?`, 'Đơn hàng đã được XÁC NHẬN')}
                                disabled={cancellingId === order.id}
                              >
                                Xác nhận đơn
                              </button>
                              <button
                                type="button"
                                className="orders-cancel-btn"
                                onClick={() => handleUpdateStatus(order.id, 'Cancelled', `Xác nhận hủy đơn #${order.id}?`, 'Đơn hàng đã bị hủy')}
                                disabled={cancellingId === order.id}
                              >
                                Hủy đơn
                              </button>
                            </>
                          )}

                          {isManageView && order.status === 'Confirmed' && (
                            <>
                              <button
                                type="button"
                                className="orders-cancel-btn" style={{ background: '#f59e0b', color: 'white', border: 'none' }}
                                onClick={() => handleUpdateStatus(order.id, 'Shipping', `Bắt đầu giao đơn #${order.id}?`, 'Đơn hàng đã chuyển sang: Đang giao')}
                                disabled={cancellingId === order.id}
                              >
                                Bắt đầu giao
                              </button>
                              <button
                                type="button"
                                className="orders-cancel-btn"
                                onClick={() => handleUpdateStatus(order.id, 'Cancelled', `Xác nhận hủy đơn #${order.id}?`, 'Đơn hàng đã bị hủy')}
                                disabled={cancellingId === order.id}
                              >
                                Hủy đơn
                              </button>
                            </>
                          )}

                          {isManageView && order.status === 'Shipping' && (
                            <button
                                type="button"
                                className="orders-cancel-btn" style={{ background: '#16a34a', color: 'white', border: 'none' }}
                                onClick={() => handleUpdateStatus(order.id, 'Delivered', `Xác nhận đơn #${order.id} giao THÀNH CÔNG?`, 'Đơn hàng đã Hoàn thành')}
                                disabled={cancellingId === order.id}
                              >
                                Đã giao hàng
                              </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {expandedId === order.id && (
                      <tr className="order-details-row">
                        <td colSpan="5">
                          <div className="order-details-card">
                            <OrderTimeline order={order} />

                            {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner') && order.status === 'Pending' && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <button 
                                  onClick={() => handleConfirmOrder(order.id)}
                                  style={{
                                    marginTop: '16px', padding: '10px 24px',
                                    backgroundColor: '#3b82f6', color: 'white',
                                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '600'
                                  }}
                                  disabled={cancellingId === order.id}
                                >
                                  {cancellingId === order.id ? <span className="orders-spinner-sm" /> : '✓ Xác nhận đơn hàng'}
                                </button>
                              </div>
                            )}

                            {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'owner') && order.status === 'Shipping' && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                                <button 
                                  onClick={() => handleConfirmDelivered(order.id)}
                                  style={{
                                    marginTop: '16px', padding: '10px 24px',
                                    backgroundColor: '#22c55e', color: 'white',
                                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: '600'
                                  }}
                                  disabled={cancellingId === order.id}
                                >
                                  {cancellingId === order.id ? <span className="orders-spinner-sm" /> : '✓ Xác nhận đã giao'}
                                </button>
                              </div>
                            )}

                            <div className="order-details-meta">
                              <div className="order-meta-item">
                                <span className="order-meta-label">👤 Người nhận</span>
                                <span>{order.fullName || '—'}</span>
                              </div>
                              <div className="order-meta-item">
                                <span className="order-meta-label">📞 Điện thoại</span>
                                <span>{order.phoneNumber || '—'}</span>
                              </div>
                              <div className="order-meta-item">
                                <span className="order-meta-label">📍 Địa chỉ</span>
                                <span>{order.shippingAddress || '—'}</span>
                              </div>
                              <div className="order-meta-item">
                                <span className="order-meta-label">💳 Thanh toán</span>
                                <span>
                                  {order.paymentMethod === 'COD'
                                    ? 'Thanh toán khi nhận hàng'
                                    : order.paymentMethod === 'BankTransfer'
                                    ? 'Chuyển khoản ngân hàng'
                                    : order.paymentMethod || '—'}
                                </span>
                              </div>
                            </div>

                            <h4>Sản phẩm</h4>
                            <ul className="order-items-list">
                              {(order.orderItems || []).map((item) => (
                                <li key={item.id} className="order-item-row">
                                  <span className="order-item-name">
                                    {item.product?.name || `Sản phẩm #${item.productId}`}
                                  </span>
                                  <span className="order-item-detail">
                                    x{item.quantity} &nbsp;·&nbsp; {formatCurrency(item.price)} / cái
                                  </span>
                                  <span className="order-item-sub">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            <div className="order-details-total">
                              Tổng cộng: <strong>{formatCurrency(order.totalPrice)}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
