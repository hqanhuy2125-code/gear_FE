import React, { useEffect, useState } from 'react';
import '../styles/Account.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const stored =
      localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      const baseName =
        (parsed.name && parsed.name !== 'Guest User' && parsed.name) ||
        (parsed.email ? parsed.email.split('@')[0] : '');
      setName(baseName || '');
      setPhone(parsed.phone || '');
      setAddress(parsed.address || '');
      setEmail(parsed.email || '');
    } catch {
      setUser(null);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name: name || user.name,
      phone,
      address,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('userLogin'));
    setUser(updatedUser);
    alert('Thông tin của bạn đã được cập nhật.');
  };

  const handleCancel = () => {
    if (!user) return;
    const baseName =
      (user.name && user.name !== 'Guest User' && user.name) ||
      (user.email ? user.email.split('@')[0] : '');
    setName(baseName || '');
    setPhone(user.phone || '');
    setAddress(user.address || '');
  };

  if (!user) {
    return (
      <div className="account-page">
        <div className="account-card">
          <h2 className="account-title">My Profile</h2>
          <p className="account-text">
            Bạn chưa đăng nhập. Vui lòng đăng nhập để xem và chỉnh sửa thông tin tài khoản.
          </p>
        </div>
      </div>
    );
  }

  const displayInitial =
    (name && name.trim().charAt(0).toUpperCase()) ||
    (email && email.trim().charAt(0).toUpperCase()) ||
    'U';

  return (
    <div className="container account-page">
      <div className="account-card">
        <h2 className="account-title">My Profile</h2>

        <div className="account-avatar-wrapper">
          <div className="account-avatar-circle">{displayInitial}</div>
        </div>

        <form className="account-form" onSubmit={handleSave}>
          <div className="account-form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="account-form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} disabled />
          </div>

          <div className="account-form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>

          <div className="account-form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ giao hàng của bạn"
            />
          </div>

          <div className="account-actions">
            <button type="submit" className="account-btn primary">
              Save Changes
            </button>
            <button
              type="button"
              className="account-btn secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

