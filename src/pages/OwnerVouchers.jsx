import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/AdminTable.css';

const emptyVoucher = { code: '', type: 'percent', value: '', minOrderValue: 0, expiryDate: '', maxUsages: 0 };

const OwnerVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editVoucher, setEditVoucher] = useState(null);
  const [form, setForm] = useState(emptyVoucher);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });
  const [search, setSearch] = useState('');

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/vouchers');
      setVouchers(Array.isArray(data) ? data : []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchVouchers(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
  };

  const openCreate = () => { setEditVoucher(null); setForm(emptyVoucher); setShowModal(true); };
  const openEdit = (v) => {
    setEditVoucher(v);
    setForm({
      code: v.code, 
      type: v.type, 
      value: v.value,
      minOrderValue: v.minOrderValue || 0,
      expiryDate: v.expiryDate?.split('T')[0] || '',
      maxUsages: v.maxUsages || 0
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    const val = parseFloat(form.value);
    if (isNaN(val) || val < 0) return showAlert('error', 'Giá trị giảm không được âm');
    if (form.type === 'percent' && val > 100) return showAlert('error', 'Phần trăm giảm không được quá 100%');
    if (parseFloat(form.minOrderValue) < 0) return showAlert('error', 'Đơn hàng tối thiểu không được âm');

    setSaving(true);
    try {
      const payload = {
        ...form,
        value: val,
        minOrderValue: parseFloat(form.minOrderValue) || 0,
        maxUsages: parseInt(form.maxUsages) || 0,
        expiryDate: new Date(form.expiryDate).toISOString()
      };
      
      if (editVoucher) {
        await api.put(`/api/vouchers/${editVoucher.id}`, payload);
      } else {
        await api.post('/api/vouchers', payload);
      }
      
      setShowModal(false);
      fetchVouchers();
      showAlert('success', editVoucher ? 'Cập nhật voucher thành công!' : 'Tạo voucher thành công!');
    } catch (err) { 
      showAlert('error', err.response?.data?.message || 'Lỗi lưu voucher'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Xóa voucher "${code}"?`)) return;
    try {
      await api.delete(`/api/vouchers/${id}`);
      fetchVouchers();
      showAlert('success', 'Đã xóa voucher.');
    } catch (err) { 
      showAlert('error', err.response?.data?.message || 'Lỗi xóa voucher'); 
    }
  };

  const now = new Date();
  const filtered = vouchers.filter(v => v.code.toLowerCase().includes(search.toLowerCase()));
  const stats = {
    total: vouchers.length,
    active: vouchers.filter(v=>new Date(v.expiryDate)>now).length,
    expired: vouchers.filter(v=>new Date(v.expiryDate)<=now).length,
  };

  return (
    <div className="admin-table-page">
      <div className="admin-page-header">
        <div>
          <h1>🏷️ Quản lý Voucher</h1>
          <p className="page-subtitle">Tạo, sửa, xóa mã giảm giá cho toàn hệ thống</p>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <Link to="/owner/dashboard" className="admin-back-btn">← Dashboard</Link>
          <button className="admin-primary-btn" onClick={openCreate}>+ Tạo voucher mới</button>
        </div>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card"><span className="admin-stat-icon">🏷️</span><div className="admin-stat-info"><h3>Tổng voucher</h3><p>{stats.total}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">✅</span><div className="admin-stat-info"><h3>Còn hiệu lực</h3><p>{stats.active}</p></div></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">⌛</span><div className="admin-stat-info"><h3>Hết hạn</h3><p>{stats.expired}</p></div></div>
      </div>

      {alert.msg && <div className={alert.type==='success'?'alert-success':'alert-error'}>{alert.msg}</div>}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <input className="admin-search-input" placeholder="Tìm theo mã voucher..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="table-loading">⏳ Đang tải vouchers...</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty"><span className="table-empty-icon">🏷️</span><p>Chưa có voucher nào.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã voucher</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Đơn tối thiểu</th>
                <th>Hạn sử dụng</th>
                <th>Đã dùng / Tối đa</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const isExpired = new Date(v.expiryDate) <= now;
                const isExhausted = v.maxUsages > 0 && v.usedCount >= v.maxUsages;
                const isActive = !isExpired && !isExhausted;
                return (
                  <tr key={v.id}>
                    <td><strong>#{v.id}</strong></td>
                    <td>
                      <code style={{ background:'#f1f5f9', padding:'3px 10px', borderRadius:6, fontSize:'0.9rem', fontWeight:700, letterSpacing:'1px' }}>
                        {v.code}
                      </code>
                    </td>
                    <td><span className={`badge ${v.type==='percent'?'badge-shipping':'badge-confirmed'}`}>{v.type==='percent'?'Phần trăm':'Cố định'}</span></td>
                    <td><strong style={{ color:'#dc2626' }}>{v.type==='percent' ? `${v.value}%` : `${Number(v.value).toLocaleString('vi-VN')} ₫`}</strong></td>
                    <td>{v.minOrderValue > 0 ? `${Number(v.minOrderValue).toLocaleString('vi-VN')} ₫` : '0 ₫'}</td>
                    <td style={{ fontSize:'0.82rem' }}>{new Date(v.expiryDate).toLocaleDateString('vi-VN')}</td>
                    <td>{v.usedCount} / {v.maxUsages === 0 ? '∞' : v.maxUsages}</td>
                    <td>
                      <span className={`badge ${isActive?'badge-active':isExpired?'badge-cancelled':'badge-blocked'}`}>
                        {isExpired ? 'Hết hạn' : isExhausted ? 'Hết lượt' : 'Đang hoạt động'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-sm btn-edit" onClick={()=>openEdit(v)}>✏️ Sửa</button>
                        <button className="btn-sm btn-delete" onClick={()=>handleDelete(v.id, v.code)}>🗑 Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal-box">
            <h3>{editVoucher ? '✏️ Sửa voucher' : '🏷️ Tạo voucher mới'}</h3>
            <form onSubmit={handleSave}>
              <div className="modal-form-group">
                <label>Mã voucher (CODE) *</label>
                <input required value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="VD: SUMMER20" style={{ textTransform:'uppercase' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="modal-form-group">
                  <label>Loại giảm giá *</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (₫)</option>
                  </select>
                </div>
                <div className="modal-form-group">
                  <label>Giá trị *</label>
                  <input required type="number" min="0" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder={form.type==='percent'?'20':'50000'} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className="modal-form-group">
                  <label>Đơn tối thiểu (₫)</label>
                  <input type="number" min="0" value={form.minOrderValue} onChange={e=>setForm({...form,minOrderValue:e.target.value})} placeholder="500000" />
                </div>
                <div className="modal-form-group">
                  <label>Số lượt tối đa (0 = không giới hạn)</label>
                  <input type="number" min="0" value={form.maxUsages} onChange={e=>setForm({...form,maxUsages:e.target.value})} placeholder="0" />
                </div>
              </div>
              <div className="modal-form-group">
                <label>Ngày hết hạn *</label>
                <input required type="date" value={form.expiryDate} onChange={e=>setForm({...form,expiryDate:e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel-modal" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-save-modal" disabled={saving}>{saving?'Đang lưu...':'💾 Lưu voucher'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerVouchers;
