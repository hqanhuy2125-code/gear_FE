import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/AdminTable.css';

const API_BASE = 'http://localhost:5130';
const empty = { name: '', description: '', price: '', category: 'Mice', stock: '', imageUrl: '', isPreOrder: false, isOrderOnly: false };

const CATEGORIES = ['Mice', 'Keyboards', 'Headphones', 'Accessories', 'Mousepad'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/products?pageSize=200');
      setProducts(data.items || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
  };

  const openCreate = () => { setEditProduct(null); setForm(empty); setShowModal(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, imageUrl: p.imageUrl, isPreOrder: p.isPreOrder, isOrderOnly: p.isOrderOnly });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editProduct) {
        await api.put(`/api/products/${editProduct.id}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      setShowModal(false);
      fetchProducts();
      showAlert('success', editProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
    } catch (err) { showAlert('error', err.response?.data?.message || err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts(); showAlert('success', 'Đã xóa sản phẩm.');
    } catch { showAlert('error', 'Lỗi xóa sản phẩm'); }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await api.patch(`/api/products/${id}/toggle-visibility`);
      fetchProducts();
    } catch { showAlert('error', 'Lỗi cập nhật trạng thái'); }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await api.patch(`/api/products/${id}/stock`, parseInt(newStock), {
        headers: { 'Content-Type': 'application/json' }
      });
      fetchProducts(); showAlert('success', 'Cập nhật tồn kho thành công!');
    } catch { showAlert('error', 'Lỗi cập nhật tồn kho'); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-table-page">
      <div className="admin-page-header">
        <div>
          <h1>📦 Quản lý Sản phẩm</h1>
          <p className="page-subtitle">Thêm, sửa, xóa và quản lý tồn kho sản phẩm</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/admin/dashboard" className="admin-back-btn">← Dashboard</Link>
          <button className="admin-primary-btn" onClick={openCreate}>+ Thêm sản phẩm</button>
        </div>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📦</span>
          <div className="admin-stat-info"><h3>Tổng sản phẩm</h3><p>{products.length}</p></div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">✅</span>
          <div className="admin-stat-info"><h3>Còn hàng</h3><p>{products.filter(p=>p.stock>0).length}</p></div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">❌</span>
          <div className="admin-stat-info"><h3>Hết hàng</h3><p>{products.filter(p=>p.stock===0&&!p.isPreOrder&&!p.isOrderOnly).length}</p></div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">🙈</span>
          <div className="admin-stat-info"><h3>Đang ẩn</h3><p>{products.filter(p=>p.isHidden).length}</p></div>
        </div>
      </div>

      {alert.msg && <div className={alert.type === 'success' ? 'alert-success' : 'alert-error'}>{alert.msg}</div>}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <input className="admin-search-input" placeholder="Tìm theo tên sản phẩm..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="filter-select" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value="all">Tất cả danh mục</option>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="table-loading">⏳ Đang tải danh sách sản phẩm...</div>
        ) : filtered.length === 0 ? (
          <div className="table-empty"><span className="table-empty-icon">📭</span><p>Không có sản phẩm nào.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ opacity: p.isHidden ? 0.5 : 1 }}>
                  <td><strong>#{p.id}</strong></td>
                  <td><img src={p.imageUrl} alt={p.name} className="product-thumb" onError={e=>e.target.style.display='none'} /></td>
                  <td style={{ maxWidth: 200 }}><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td style={{ fontWeight: 700, color: '#dc2626' }}>{Number(p.price).toLocaleString('vi-VN')} ₫</td>
                  <td>
                    <input
                      type="number" min="0" defaultValue={p.stock}
                      style={{ width: 70, padding: '4px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: '0.85rem' }}
                      onBlur={e=>{ if(parseInt(e.target.value)!==p.stock) handleStockUpdate(p.id, e.target.value); }}
                    />
                  </td>
                  <td>
                    {p.isPreOrder && <span className="badge badge-confirmed">Pre-order</span>}
                    {p.isOrderOnly && <span className="badge badge-pending">Order only</span>}
                    {!p.isPreOrder && !p.isOrderOnly && <span className={`badge ${p.stock>0?'badge-instock':'badge-outstock'}`}>{p.stock>0?'Còn hàng':'Hết hàng'}</span>}
                  </td>
                  <td>
                    <span className={`badge ${p.isHidden ? 'badge-hidden' : 'badge-active'}`}>{p.isHidden ? 'Đang ẩn' : 'Hiển thị'}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-sm btn-edit" onClick={() => openEdit(p)}>✏️ Sửa</button>
                      <button className={`btn-sm ${p.isHidden ? 'btn-show' : 'btn-hide'}`} onClick={() => handleToggleVisibility(p.id)}>
                        {p.isHidden ? '👁 Hiện' : '🙈 Ẩn'}
                      </button>
                      <button className="btn-sm btn-delete" onClick={() => handleDelete(p.id, p.name)}>🗑 Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="modal-box">
            <h3>{editProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
            <form onSubmit={handleSave}>
              <div className="modal-form-group">
                <label>Tên sản phẩm *</label>
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="VD: Logitech G Pro X" />
              </div>
              <div className="modal-form-group">
                <label>Mô tả</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Mô tả sản phẩm..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="modal-form-group">
                  <label>Giá (VNĐ) *</label>
                  <input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="2500000" />
                </div>
                <div className="modal-form-group">
                  <label>Tồn kho *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="50" />
                </div>
              </div>
              <div className="modal-form-group">
                <label>Danh mục *</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="modal-form-group">
                <label>URL ảnh</label>
                <input value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', padding: '4px 0' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.88rem', cursor:'pointer' }}>
                  <input type="checkbox" checked={form.isPreOrder} onChange={e=>setForm({...form,isPreOrder:e.target.checked})} /> Pre-order
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.88rem', cursor:'pointer' }}>
                  <input type="checkbox" checked={form.isOrderOnly} onChange={e=>setForm({...form,isOrderOnly:e.target.checked})} /> Order only
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel-modal" onClick={()=>setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-save-modal" disabled={saving}>{saving?'Đang lưu...':'💾 Lưu'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
