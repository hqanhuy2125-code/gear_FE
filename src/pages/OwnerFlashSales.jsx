import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminTable.css';

const API_BASE = 'http://localhost:5130';
const emptyForm = { name: '', description: '', discountPercent: '', startTime: '', endTime: '', productIds: '', isActive: true };

const OwnerFlashSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/flash-sales');
      setSales(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchSales(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
  };

  const openCreate = () => { setEditSale(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (s) => {
    setEditSale(s);
    setForm({
      name: s.name, description: s.description, discountPercent: s.discountPercent,
      startTime: s.startTime?.slice(0,16) || '', endTime: s.endTime?.slice(0,16) || '',
      productIds: s.productIds, isActive: s.isActive
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Split productIds string into an array of integers
      const productIdArray = typeof form.productIds === 'string' 
        ? form.productIds.split(',').map(x => x.trim()).filter(x => x !== '').map(Number)
        : form.productIds;

      const payload = {
        ...form,
        discountPercent: parseFloat(form.discountPercent),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        productIds: productIdArray
      };

      if (editSale) {
        await api.put(`/api/flash-sales/${editSale.id}`, payload);
      } else {
        await api.post('/api/flash-sales', payload);
      }
      setShowModal(false); 
      fetchSales();
      showAlert('success', editSale ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
    } catch (err) { 
      const errorMsg = err.response?.data?.message || err.response?.data?.title || 'Lỗi hệ thống';
      showAlert('error', errorMsg); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa flash sale này?')) return;
    try {
      await api.delete(`/api/flash-sales/${id}`);
      fetchSales(); showAlert('success', 'Đã xóa flash sale.');
    } catch { showAlert('error', 'Lỗi xóa'); }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/api/flash-sales/${id}/toggle`);
      fetchSales();
    } catch { showAlert('error', 'Lỗi cập nhật'); }
  };

  const now = new Date();
  const stats = {
    total: sales.length,
    active: sales.filter(s=>s.isActive&&new Date(s.endTime)>now).length,
    ended: sales.filter(s=>new Date(s.endTime)<=now).length,
  };

  return (
    <div className="admin-table-page">
      <div className="admin-page-header">
        <div>
          <h1>⚡ Quản lý Flash Sale</h1>
          <p className="page-subtitle">Tạo và quản lý các chương trình flash sale</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <Link to="/owner/dashboard" className="admin-back-btn">← Dashboard</Link>
          <button className="admin-primary-btn" onClick={openCreate}>+ Tạo Flash Sale</button>
        </div>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card"><span className="admin-stat-icon">⚡</span><div className="admin-stat-info"><h3>Tổng</h3><p>{stats.total}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">🔥</span><div className="admin-stat-info"><h3>Đang diễn ra</h3><p>{stats.active}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">✔️</span><div className="admin-stat-info"><h3>Đã kết thúc</h3><p>{stats.ended}</p></div></div>
      </div>

      {alert.msg && <div className={alert.type==='success'?'alert-success':'alert-error'}>{alert.msg}</div>}

      <div className="admin-table-container">
        {loading ? (
          <div className="table-loading">⏳ Đang tải...</div>
        ) : sales.length === 0 ? (
          <div className="table-empty"><span className="table-empty-icon">⚡</span><p>Chưa có flash sale nào.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Tên chương trình</th><th>Giảm giá</th>
                <th>Bắt đầu</th><th>Kết thúc</th><th>Trạng thái</th><th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => {
                const ended = new Date(s.endTime) <= now;
                const active = s.isActive && !ended;
                return (
                  <tr key={s.id}>
                    <td><strong>#{s.id}</strong></td>
                    <td>
                      <strong>{s.name}</strong>
                      {s.description && <div style={{ fontSize:'0.78rem', color:'#64748b' }}>{s.description}</div>}
                    </td>
                    <td><strong style={{ color:'#dc2626', fontSize:'1.1rem' }}>{s.discountPercent}%</strong></td>
                    <td style={{ fontSize:'0.82rem' }}>{new Date(s.startTime).toLocaleString('vi-VN')}</td>
                    <td style={{ fontSize:'0.82rem' }}>{new Date(s.endTime).toLocaleString('vi-VN')}</td>
                    <td>
                      <span className={`badge ${active?'badge-active':ended?'badge-hidden':'badge-blocked'}`}>
                        {active ? '🔥 Đang chạy' : ended ? '✔️ Đã kết thúc' : '⏸ Tạm dừng'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        {!ended && <button className={`btn-sm ${s.isActive?'btn-block':'btn-unblock'}`} onClick={()=>handleToggle(s.id)}>{s.isActive?'⏸ Dừng':'▶️ Bật'}</button>}
                        <button className="btn-sm btn-edit" onClick={()=>openEdit(s)}>✏️ Sửa</button>
                        <button className="btn-sm btn-delete" onClick={()=>handleDelete(s.id)}>🗑 Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal-box">
            <h3>{editSale ? '✏️ Sửa Flash Sale' : '⚡ Tạo Flash Sale mới'}</h3>
            <form onSubmit={handleSave}>
              <div className="modal-form-group">
                <label>Tên chương trình *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="VD: Flash Sale Thứ 6" />
              </div>
              <div className="modal-form-group">
                <label>Mô tả</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Mô tả ngắn..." rows={2} />
              </div>
              <div className="modal-form-group">
                <label>Phần trăm giảm (%) *</label>
                <input required type="number" min="1" max="100" value={form.discountPercent} onChange={e=>setForm({...form,discountPercent:e.target.value})} placeholder="20" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="modal-form-group">
                  <label>Thời gian bắt đầu *</label>
                  <input required type="datetime-local" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} />
                </div>
                <div className="modal-form-group">
                  <label>Thời gian kết thúc *</label>
                  <input required type="datetime-local" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} />
                </div>
              </div>
              <div className="modal-form-group">
                <label>Product IDs (phân cách bởi dấu phẩy)</label>
                <input value={form.productIds} onChange={e=>setForm({...form,productIds:e.target.value})} placeholder="1,2,3,5" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel-modal" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-save-modal" disabled={saving}>{saving?'Đang lưu...':'⚡ Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerFlashSales;
