import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastName, setToastName] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const baseName = email.includes('@') ? email.split('@')[0] : email;
      const displayName =
        email === 'hqanhuy@gear.com' && password === 'hqanhuy' ? 'Huy' : baseName;

      const user = {
        email,
        name: displayName,
        role: email === 'hqanhuy@gear.com' && password === 'hqanhuy' ? 'admin' : 'customer',
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.dispatchEvent(new Event('userLogin'));
      sessionStorage.setItem('justLoggedIn', 'true');

      setToastName(displayName);
      setShowToast(true);
      setTimeout(() => {
        navigate('/');
      }, 1800);
    }
  };

  return (
    <div className="login-container">

      {showToast && (
        <div className="login-success-toast">
          <span className="toast-icon">✅</span>
          <div className="toast-text">
            <strong>Đăng nhập thành công!</strong>
            <span>Chào mừng trở lại, {toastName}! Đang chuyển hướng...</span>
          </div>
        </div>
      )}

      <div className="login-card">
        <h2 className="login-title">ĐĂNG NHẬP HỆ THỐNG</h2>
        <p className="login-subtitle">Truy cập vào tài khoản SCYTOL CLX21 của bạn</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Ghi nhớ đăng nhập
            </label>
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="login-submit-btn">
            Đăng nhập
          </button>
        </form>

        <div className="login-footer">
          Chưa có tài khoản? <a href="#" className="register-link">Tạo tài khoản mới</a>
        </div>
      </div>
    </div>
  );
};

export default Login;