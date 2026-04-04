import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminTable.css';

const API_BASE = 'http://localhost:5130';

const CONFIG_DISPLAY = {
  shipping_fee: { label: 'Phí vận chuyển mặc định', icon: '🚚', suffix: 'VNĐ', type: 'number' },
  free_shipping_threshold: { label: 'Miễn phí ship từ', icon: '🎁', suffix: 'VNĐ', type: 'number' },
  return_policy_days: { label: 'Số ngày đổi trả', icon: '↩️', suffix: 'ngày', type: 'number' },
  return_policy_note: { label: 'Điều kiện đổi trả', icon: '📋', suffix: '', type: 'text' },
  site_name: { label: 'Tên website', icon: '🌐', suffix: '', type: 'text' },
};

const OwnerSystemConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState({});
  const [alert, setAlert] = useState({ type: '', msg: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/system-config`, { headers });
      const data = await res.json();
      setConfigs(Array.isArray(data) ? data : []);
      const initial = {};
      (Array.isArray(data) ? data : []).forEach(c => { initial[c.key] = c.value; });
      setEditing(initial);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchConfigs(); }, []);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert({ type: '', msg: '' }), 3000);
  };

  const handleSave = async (key) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/system-config/${key}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: editing[key] })
      });
      if (!res.ok) throw new Error('Lỗi cập nhật cấu hình');
      fetchConfigs();
      showAlert('success', `Đã lưu cài đặt "${CONFIG_DISPLAY[key]?.label || key}"`);
    } catch (err) { showAlert('error', err.message); }
    finally { setSaving(prev => ({ ...prev, [key]: false })); }
  };

  return (
    <div className="admin-table-page">
      <div className="admin-page-header">
        <div>
          <h1>⚙️ Cấu hình Hệ thống</h1>
          <p className="page-subtitle">Cài đặt phí ship, chính sách đổi trả và các thông số toàn site</p>
        </div>
        <Link to="/owner/dashboard" className="admin-back-btn">← Dashboard</Link>
      </div>

      {alert.msg && <div className={alert.type==='success'?'alert-success':'alert-error'}>{alert.msg}</div>}

      {loading ? (
        <div className="table-loading">⏳ Đang tải cấu hình...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {configs.map(config => {
            const display = CONFIG_DISPLAY[config.key] || { label: config.key, icon: '⚙️', suffix: '', type: 'text' };
            return (
              <div key={config.key} style={{ background: 'white', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                      <span style={{ fontSize:'1.4rem' }}>{display.icon}</span>
                      <div>
                        <strong style={{ fontSize:'1rem', color:'#1e293b' }}>{display.label}</strong>
                        <div style={{ fontSize:'0.78rem', color:'#94a3b8', fontFamily:'monospace' }}>{config.key}</div>
                      </div>
                    </div>
                    {config.description && <p style={{ fontSize:'0.83rem', color:'#64748b', margin:'4px 0 0 0' }}>{config.description}</p>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:300 }}>
                    <div style={{ flex:1, display:'flex', alignItems:'center', border:'1.5px solid #e2e8f0', borderRadius:8, overflow:'hidden', background:'#f8fafc' }}>
                      <input
                        type={display.type}
                        value={editing[config.key] || ''}
                        onChange={e => setEditing(prev=>({...prev,[config.key]:e.target.value}))}
                        style={{ flex:1, padding:'9px 12px', border:'none', background:'transparent', fontSize:'0.9rem', outline:'none' }}
                      />
                      {display.suffix && (
                        <span style={{ padding:'0 12px', color:'#94a3b8', fontSize:'0.83rem', whiteSpace:'nowrap' }}>{display.suffix}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleSave(config.key)}
                      disabled={saving[config.key] || editing[config.key] === config.value}
                      style={{ padding:'9px 18px', background: editing[config.key]===config.value?'#e2e8f0':'linear-gradient(135deg,#3b82f6,#2563eb)', color:editing[config.key]===config.value?'#94a3b8':'white', border:'none', borderRadius:8, fontWeight:700, cursor:editing[config.key]===config.value?'not-allowed':'pointer', fontSize:'0.85rem', whiteSpace:'nowrap', transition:'all 0.2s' }}
                    >
                      {saving[config.key] ? '...' : '💾 Lưu'}
                    </button>
                  </div>
                </div>
                <div style={{ marginTop:8, fontSize:'0.78rem', color:'#94a3b8' }}>
                  Cập nhật lần cuối: {new Date(config.updatedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerSystemConfig;
