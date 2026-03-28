import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BasePolicyPage = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="policy-page-container" style={{
      padding: '120px 20px 60px',
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: '80vh',
      lineHeight: '1.6',
      color: 'var(--text-color, #333)'
    }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#1877F2',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          marginBottom: '32px',
          padding: '0'
        }}
      >
        <ArrowLeft size={20} />
        Quay lại trang chủ
      </button>

      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        marginBottom: '40px',
        color: 'var(--heading-color, #111)'
      }}>
        {title}
      </h1>

      <div className="policy-content" style={{
        backgroundColor: 'var(--card-bg, #fff)',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        {children}
      </div>
    </div>
  );
};

export default BasePolicyPage;
