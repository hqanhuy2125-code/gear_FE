import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Login.css';
import '../styles/LoginOtp.css';

const API_BASE = 'http://localhost:5130';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastName, setToastName] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // OTP states
  const [otpStep, setOtpStep] = useState(1); // 1: Login/Register form, 2: Enter OTP
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // data = { id, name, email, role }
      login(data);
      setToastName(data.name);
      setToastMessage('Chào mừng trở lại');
      setShowToast(true);

      setTimeout(() => {
        const from = location.state?.from || (data.role === 'owner' ? '/owner' : data.role === 'admin' ? '/admin' : '/');
        navigate(from);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập Google thất bại');
      }

      setEmail(data.email);
      setName(data.name || '');
      setOtpStep(2);
      setCountdown(10);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Lỗi đăng nhập qua Google');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      setToastName(name);
      setToastMessage('Đăng ký thành công! Đang chuyển về trang đăng nhập...');
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Không thể gửi mã OTP');
      }

      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err.message || 'Lỗi gửi mã OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length !== 6) {
      setError('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Xác thực OTP thất bại');
      }

      // data = { id, name, email, role }
      login(data);
      setToastName(data.name);
      setToastMessage('Chào mừng trở lại');
      setShowToast(true);

      setTimeout(() => {
        const from = location.state?.from || (data.role === 'owner' ? '/owner' : data.role === 'admin' ? '/admin' : '/');
        navigate(from);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Lỗi xác thực OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInputChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtpCode = [...otpCode];
    newOtpCode[index] = value.slice(-1); // Only keep the last digit
    setOtpCode(newOtpCode);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpInputKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="login-container">

      {showToast && (
        <div className="login-success-toast">
          <span className="toast-icon">✅</span>
          <div className="toast-text">
            <strong>Thành công!</strong>
            <span>{toastMessage}, {toastName}!</span>
          </div>
        </div>
      )}

      <div className="login-card">
        <h2 className="login-title">
          {otpStep === 2 ? 'NHẬP MÃ XÁC NHẬN' : (isRegistering ? 'ĐĂNG KÝ TÀI KHOẢN' : 'ĐĂNG NHẬP HỆ THỐNG')}
        </h2>
        <p className="login-subtitle">
          {otpStep === 2 ? `Mã OTP đã được gửi đến ${email}` : (isRegistering ? 'Tạo tài khoản SCYTOL CLX21 mới' : 'Truy cập vào tài khoản SCYTOL CLX21 của bạn')}
        </p>

        {error && (
          <div className="login-error-msg">
            ⚠️ {error}
          </div>
        )}

        {otpStep === 1 ? (
          <form className="login-form" onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {!isRegistering && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <a href="#" className="forgot-password">Quên mật khẩu?</a>
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <span className="login-spinner-wrap">
                <span className="login-spinner" />
                Đang xử lý...
              </span>
            ) : isRegistering ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>
        ) : (
          <form className="login-form" onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <div className="otp-inputs-grid">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpInputKeyDown(index, e)}
                    disabled={loading}
                    className="otp-digit-input"
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="login-submit-btn" style={{ flex: 1, marginTop: 0 }} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Xác nhận OTP'}
              </button>
              <button 
                type="button" 
                className="method-tab" 
                style={{ flex: 1, textAlign: 'center' }}
                onClick={handleResendOtp}
                disabled={loading || countdown > 0}
              >
                {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
              </button>
            </div>
          </form>
        )}

        {otpStep === 1 && (
          <>
            <div className="login-divider">
              <span>hoặc</span>
            </div>
            
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  setError('Đăng nhập Google thất bại');
                }}
                useOneTap
                shape="rectangular"
                theme="outline"
              />
            </div>
            
            <div className="login-footer">
              {isRegistering ? (
                <>Đã có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); setError(''); setIsRegistering(false); }} className="register-link">Đăng nhập ngay</a></>
              ) : (
                <>Chưa có tài khoản? <a href="#" onClick={(e) => { e.preventDefault(); setError(''); setIsRegistering(true); }} className="register-link">Tạo tài khoản mới</a></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;