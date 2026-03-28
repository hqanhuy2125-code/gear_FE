import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────
   CANVAS PARTICLES BACKGROUND
────────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.6)';
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 120) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
};

/* ─────────────────────────────────────────
   COUNT-UP HOOK
────────────────────────────────────────── */
const useCountUp = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ─────────────────────────────────────────
   FADE-IN WRAPPER
────────────────────────────────────────── */
const FadeIn = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────── */
const Security = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const c1 = useCountUp(4, 1000, statsVisible);
  const c2 = useCountUp(100, 1400, statsVisible);
  const c3 = useCountUp(15, 900, statsVisible);
  const c4 = useCountUp(256, 1800, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const S = {
    page: {
      background: '#0a0f1e',
      color: '#e2e8f0',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden',
    },
    // ── Hero
    hero: {
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '0 24px',
      background: 'radial-gradient(ellipse at center, #0d1b3e 0%, #0a0f1e 70%)',
      overflow: 'hidden',
    },
    backBtn: {
      position: 'absolute', top: 24, left: 24, zIndex: 10,
      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,212,255,0.3)',
      color: '#00d4ff', padding: '8px 18px', borderRadius: 30,
      textDecoration: 'none', fontSize: 13, fontWeight: 600,
      backdropFilter: 'blur(10px)', transition: 'all 0.3s',
    },
    systemBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.4)',
      color: '#10b981', padding: '6px 16px', borderRadius: 20,
      fontSize: 13, fontWeight: 600, marginBottom: 28, zIndex: 1,
    },
    pulse: {
      width: 8, height: 8, borderRadius: '50%', background: '#10b981',
      animation: 'secPulse 1.4s infinite',
    },
    heroTitle: {
      fontFamily: 'monospace', fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 900,
      color: '#fff', lineHeight: 1.1, marginBottom: 20, zIndex: 1, position: 'relative',
      textShadow: '0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2)',
      animation: 'secGlitch 8s infinite',
    },
    heroSub: {
      color: '#94a3b8', fontSize: 18, maxWidth: 520, zIndex: 1, marginBottom: 56,
      letterSpacing: '0.05em',
    },
    statsRow: {
      display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1,
    },
    statCard: {
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)',
      borderRadius: 16, padding: '24px 32px', textAlign: 'center',
      backdropFilter: 'blur(10px)', minWidth: 120,
      transition: 'border-color 0.3s, transform 0.3s',
    },
    statNum: {
      fontFamily: 'monospace', fontSize: 46, fontWeight: 900, color: '#00d4ff',
      textShadow: '0 0 20px rgba(0,212,255,0.5)',
    },
    statLabel: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 },
    scrollArrow: {
      position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
      color: '#00d4ff', fontSize: 28, animation: 'secBounce 2s infinite', zIndex: 1, cursor: 'pointer',
    },

    // ── Sections
    section: { padding: '100px 24px', maxWidth: 1200, margin: '0 auto' },
    sectionBig: { padding: '100px 24px' },
    secInner: { maxWidth: 1200, margin: '0 auto' },

    // ── Section headings
    layerBadge: (color) => ({
      display: 'inline-block', background: `${color}22`, border: `1px solid ${color}66`,
      color: color, padding: '4px 12px', borderRadius: 20, fontSize: 11,
      fontWeight: 700, marginBottom: 12, letterSpacing: '0.1em',
    }),
    sectionTitle: { fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 16 },
    sectionDesc: { color: '#94a3b8', fontSize: 16, lineHeight: 1.7, maxWidth: 480 },

    // ── CORS
    corsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'center' },
    originRow: (ok) => ({
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: 'monospace', fontSize: 14, color: ok ? '#10b981' : '#ef4444',
      padding: '10px 14px', background: ok ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
      border: `1px solid ${ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
      borderRadius: 8, marginBottom: 8,
    }),
    methodBadge: (color) => ({
      display: 'inline-block', background: `${color}22`, color: color,
      border: `1px solid ${color}55`, padding: '4px 10px', borderRadius: 6,
      fontSize: 12, fontWeight: 700, fontFamily: 'monospace', marginRight: 6, marginBottom: 6,
    }),

    // ── CORS Flow Diagram
    flowBox: (color) => ({
      background: `rgba(${color},0.08)`, border: `1px solid rgba(${color},0.35)`,
      borderRadius: 10, padding: '12px 18px', textAlign: 'center', fontSize: 13,
      fontFamily: 'monospace', color: '#e2e8f0', minWidth: 100,
    }),
    flowArrow: { color: '#00d4ff', fontSize: 22, padding: '0 8px', alignSelf: 'center' },

    // ── Validation table
    valCard: {
      background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(0,212,255,0.03) 100%)',
      border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, overflow: 'hidden',
    },
    valHeader: {
      background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(0,212,255,0.1))',
      padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 16,
    },
    valIcon: { fontSize: 42 },
    valTable: { width: '100%', borderCollapse: 'collapse' },
    valTh: { padding: '12px 20px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', background: 'rgba(0,0,0,0.3)' },
    valTd: (i) => ({
      padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
    }),
    codeBlock: {
      background: '#000', borderRadius: 10, padding: '18px 22px', fontFamily: 'monospace',
      fontSize: 13, color: '#10b981', overflowX: 'auto', border: '1px solid rgba(16,185,129,0.2)',
      marginTop: 24,
    },

    // ── Role cards
    roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 },
    roleCard: (color) => ({
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}55`,
      borderRadius: 20, padding: '28px 24px', transition: 'all 0.3s', cursor: 'default',
      boxShadow: `0 0 0 transparent`,
    }),
    roleBadge: (color) => ({
      display: 'inline-block', background: `${color}22`, color, border: `1px solid ${color}55`,
      padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, marginBottom: 16,
    }),
    perm: (ok) => ({
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
      color: ok ? '#99f6e4' : '#6b7280', fontSize: 14,
    }),

    // ── Permission matrix
    matrix: { width: '100%', borderCollapse: 'collapse', marginTop: 48 },
    mTh: { padding: '12px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, background: 'rgba(0,0,0,0.4)', color: '#94a3b8' },
    mTd: (i) => ({ padding: '13px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', fontSize: 14, color: '#cbd5e1' }),

    // ── JWT Timeline
    timeline: { display: 'flex', flexDirection: 'column', gap: 0 },
    tlItem: { display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 8 },
    tlLine: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 },
    tlDot: (color) => ({
      width: 42, height: 42, borderRadius: '50%', background: `${color}22`,
      border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, flexShrink: 0, boxShadow: `0 0 12px ${color}44`,
    }),
    tlConnector: { width: 2, flex: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0', minHeight: 28 },
    tlContent: { padding: '4px 0 24px' },
    tlTitle: { fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 },
    tlDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.6 },

    // ── Security feature cards
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 40 },
    featureCard: {
      background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.25)',
      borderRadius: 14, padding: '20px', transition: 'all 0.3s',
    },
    featureIcon: { fontSize: 26, marginBottom: 10 },
    featureTitle: { fontSize: 14, fontWeight: 700, color: '#a78bfa', marginBottom: 6 },
    featureDesc: { fontSize: 12, color: '#64748b', lineHeight: 1.6 },

    // ── Custom Footer
    footer: {
      background: '#000', padding: '48px 24px', textAlign: 'center',
      borderTop: '1px solid rgba(0,212,255,0.1)', position: 'relative', overflow: 'hidden',
    },
    footerLine: { fontFamily: 'monospace', fontSize: 13, color: '#10b981', marginBottom: 8, letterSpacing: '0.08em' },
    techBadge: {
      display: 'inline-block', background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)',
      color: '#00d4ff', padding: '5px 12px', borderRadius: 6, fontSize: 11,
      fontFamily: 'monospace', margin: '4px', fontWeight: 600,
    },
  };

  const timelineSteps = [
    { color: '#00d4ff', icon: '🔐', title: 'LOGIN', desc: 'User nhập email/password → Backend xác thực BCrypt' },
    { color: '#7c3aed', icon: '🎫', title: 'TOKENS ISSUED', desc: 'Access Token (15 phút) → Lưu trong memory.\nRefresh Token (7 ngày) → HttpOnly Cookie (JS không đọc được)' },
    { color: '#10b981', icon: '📡', title: 'API REQUESTS', desc: 'Mỗi request gửi kèm Access Token trong Authorization header' },
    { color: '#f59e0b', icon: '⏰', title: 'TOKEN EXPIRED', desc: 'Sau 15 phút, API trả về 401 → Axios interceptor phát hiện tự động' },
    { color: '#00d4ff', icon: '🔄', title: 'AUTO REFRESH (Silent)', desc: 'Gọi /api/auth/refresh-token → Nhận Access Token mới. User KHÔNG bị logout' },
    { color: '#ef4444', icon: '🚨', title: 'LOGOUT / ATTACK DETECTED', desc: 'Revoke token trong DB → Blacklist toàn bộ session → Redirect về /login' },
  ];

  return (
    <div style={S.page}>
      {/* Global Keyframes */}
      <style>{`
        @keyframes secPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes secGlitch {
          0%,95%,100%{text-shadow:0 0 40px rgba(0,212,255,0.5),0 0 80px rgba(0,212,255,0.2)}
          96%{text-shadow:-2px 0 #ff00c8,2px 2px #00d4ff}
          97%{text-shadow:2px -2px #ff00c8,-2px 0 #00d4ff}
          98%{text-shadow:0 0 40px rgba(0,212,255,0.5)}
        }
        @keyframes secBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }
        @keyframes corsFlow {
          0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0}
        }
        .sec-role-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .sec-feature-card:hover { background: rgba(124,58,237,0.12); border-color: rgba(124,58,237,0.5); transform: translateY(-4px); }
        .sec-stat-card:hover { border-color: rgba(0,212,255,0.5); transform: translateY(-4px); }
        .sec-back:hover { background: rgba(0,212,255,0.12); border-color: rgba(0,212,255,0.6); }
      `}</style>

      {/* ── HERO ─────────────────────────── */}
      <section style={S.hero}>
        <ParticleCanvas />

        <Link to="/" style={S.backBtn} className="sec-back">← Trang chủ</Link>

        <div style={S.systemBadge}>
          <div style={S.pulse} />
          🟢 ALL SYSTEMS SECURE
        </div>

        <h1 style={S.heroTitle}>SECURITY SYSTEM</h1>
        <p style={S.heroSub}>SCYTOL CLX21 — Enterprise Security Architecture</p>

        <div style={S.statsRow} ref={statsRef}>
          {[
            { num: c1, suffix: '', label: 'Lớp Bảo Vệ' },
            { num: c2, suffix: '/min', label: 'Rate Limit' },
            { num: c3, suffix: 'p', label: 'Token TTL' },
            { num: c4, suffix: '-bit', label: 'Encryption' },
          ].map((s, i) => (
            <div key={i} style={S.statCard} className="sec-stat-card">
              <div style={S.statNum}>{s.num}{s.suffix}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={S.scrollArrow}>↓</div>
      </section>

      {/* ── SECTION 1: CORS ──────────────── */}
      <section style={{ ...S.sectionBig, background: 'rgba(0,212,255,0.02)', borderTop: '1px solid rgba(0,212,255,0.08)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div style={S.secInner}>
          <FadeIn>
            <div style={S.corsGrid}>
              {/* Left */}
              <div>
                <div style={S.layerBadge('#00d4ff')}>🌐 LAYER 1</div>
                <h2 style={S.sectionTitle}>CORS Protection</h2>
                <p style={S.sectionDesc}>
                  Cross-Origin Resource Sharing (CORS) kiểm soát chặt chẽ domain nào được phép gọi API. Mọi request từ domain không được phép sẽ bị chặn ngay ở browser level.
                </p>

                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>ALLOWED ORIGINS</div>
                  <div style={S.originRow(true)}>✅ <span>http://localhost:5173</span></div>
                  <div style={S.originRow(true)}>✅ <span>http://localhost:5174</span></div>
                  <div style={S.originRow(false)}>❌ <span>* All other domains → BLOCKED</span></div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>ALLOWED METHODS</div>
                  <div>
                    {[['GET', '#10b981'], ['POST', '#3b82f6'], ['PUT', '#f59e0b'], ['DELETE', '#ef4444'], ['OPTIONS', '#7c3aed']].map(([m, c]) => (
                      <span key={m} style={S.methodBadge(c)}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Flow Diagram */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>REQUEST FLOW</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent:'center' }}>
                  <div style={S.flowBox('0,212,255')}>🌍<br/>Browser<br/>Request</div>
                  <div style={S.flowArrow}>→</div>
                  <div style={{ ...S.flowBox('124,58,237'), position: 'relative' }}>
                    🛡️<br/>CORS<br/>Filter
                    <div style={{
                      position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
                    }}>
                      <div style={{ width: 2, height: 20, background: '#ef4444' }} />
                      <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        ❌ BLOCKED
                      </div>
                    </div>
                  </div>
                  <div style={S.flowArrow}>→</div>
                  <div style={S.flowBox('16,185,129')}>⚡<br/>API<br/>Server</div>
                </div>

                <div style={{ marginTop: 90, background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>CORS CONFIG (Program.cs)</div>
                  <pre style={{ fontFamily: 'monospace', fontSize: 12, color: '#a78bfa', margin: 0 }}>{`.WithOrigins(
  "http://localhost:5173",
  "http://localhost:5174"
)
.WithHeaders("Authorization", "Content-Type")
.AllowCredentials()`}</pre>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 2: VALIDATION ────────── */}
      <section style={S.sectionBig}>
        <div style={S.secInner}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={S.layerBadge('#10b981')}>✅ LAYER 2</div>
              <h2 style={S.sectionTitle}>Input Validation</h2>
              <p style={{ ...S.sectionDesc, maxWidth: 560, margin: '0 auto' }}>
                FluentValidation tự động kiểm tra toàn bộ dữ liệu đầu vào trước khi vào Controller.
              </p>
            </div>

            <div style={S.valCard}>
              <div style={S.valHeader}>
                <div style={S.valIcon}>🔍</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>FluentValidation</div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>Tự động validate trước khi vào Controller — trả về 400 nếu sai</div>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={S.valTable}>
                  <thead>
                    <tr>
                      {['Field', 'Rule', 'Error Message'].map(h => <th key={h} style={S.valTh}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['💰 Price', '> 0 và < 100,000,000', 'Giá sản phẩm không hợp lệ'],
                      ['📝 Name', 'NotEmpty, MaxLength(200)', 'Tên sản phẩm là bắt buộc'],
                      ['📦 Stock', '0 đến 10,000', 'Vượt giới hạn tồn kho'],
                      ['📱 Phone', '^0[3-9]\\d{8}$ (optional)', 'SĐT không đúng định dạng VN'],
                      ['📧 Email', 'Valid email format', 'Địa chỉ email không hợp lệ'],
                      ['🔑 Password', 'Min 8, hoa+thường+số', 'Mật khẩu quá yếu'],
                    ].map(([field, rule, err], i) => (
                      <tr key={i}>
                        <td style={{ ...S.valTd(i), fontFamily: 'monospace', color: '#00d4ff' }}>{field}</td>
                        <td style={{ ...S.valTd(i), color: '#10b981' }}>{rule}</td>
                        <td style={{ ...S.valTd(i), color: '#f87171' }}>{err}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <div style={S.codeBlock}>
                  <div style={{ color: '#64748b', marginBottom: 8, fontSize: 11 }}>// Response khi validation thất bại — HTTP 400</div>
                  {`{
  "errors": {
    "price": ["Giá phải lớn hơn 0"],
    "phoneNumber": ["SĐT không đúng định dạng VN"],
    "items": ["Đơn hàng phải có ít nhất 1 sản phẩm"]
  }
}`}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 3: ROLES ─────────────── */}
      <section style={{ ...S.sectionBig, background: 'rgba(124,58,237,0.03)', borderTop: '1px solid rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div style={S.secInner}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={S.layerBadge('#7c3aed')}>🔐 LAYER 3</div>
              <h2 style={S.sectionTitle}>Role Authorization</h2>
              <p style={{ ...S.sectionDesc, maxWidth: 560, margin: '0 auto' }}>
                Hệ thống phân quyền 3 tầng dựa trên ASP.NET Core Policy Authorization.
              </p>
            </div>

            <div style={S.roleGrid}>
              {[
                {
                  color: '#f59e0b', icon: '👑', name: 'OWNER', badge: 'FULL ACCESS',
                  policy: 'OwnerOnly',
                  perms: ['Xem doanh thu & thống kê', "Cấp/thu hồi quyền Admin", 'Toàn quyền hệ thống'],
                  denied: [],
                },
                {
                  color: '#3b82f6', icon: '🛡️', name: 'ADMIN', badge: 'MANAGEMENT',
                  policy: 'AdminOrOwner',
                  perms: ['Quản lý đơn hàng', 'Quản lý sản phẩm', 'Quản lý người dùng'],
                  denied: ['Không xem doanh thu'],
                },
                {
                  color: '#10b981', icon: '👤', name: 'USER', badge: 'SHOPPING',
                  policy: 'AllUsers',
                  perms: ['Mua hàng', 'Xem đơn của mình', 'Đánh giá sản phẩm'],
                  denied: ['Không quản lý hệ thống'],
                },
              ].map(role => (
                <div key={role.name} style={S.roleCard(role.color)} className="sec-role-card">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{role.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{role.name}</div>
                  <div style={S.roleBadge(role.color)}>{role.badge}</div>
                  <div style={{ marginTop: 16, marginBottom: 16 }}>
                    {role.perms.map(p => <div key={p} style={S.perm(true)}>✅ {p}</div>)}
                    {role.denied.map(p => <div key={p} style={S.perm(false)}>❌ {p}</div>)}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>
                    Policy: <span style={{ color: role.color }}>[{role.policy}]</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Permission Matrix */}
            <FadeIn delay={200}>
              <div style={{ marginTop: 60, overflowX: 'auto' }}>
                <div style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Permission Matrix</div>
                <table style={S.matrix}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <th style={{ ...S.mTh, textAlign: 'left', paddingLeft: 28 }}>Action</th>
                      <th style={{ ...S.mTh, color: '#f59e0b' }}>👑 Owner</th>
                      <th style={{ ...S.mTh, color: '#3b82f6' }}>🛡️ Admin</th>
                      <th style={{ ...S.mTh, color: '#10b981' }}>👤 User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Xem doanh thu', true, false, false],
                      ['Quản lý sản phẩm', true, true, false],
                      ['Quản lý đơn hàng', true, true, false],
                      ['Quản lý người dùng', true, true, false],
                      ['Mua hàng', true, true, true],
                      ['Xem đơn của mình', true, true, true],
                      ['Cấp quyền Admin', true, false, false],
                    ].map(([action, o, a, u], i) => (
                      <tr key={action}>
                        <td style={{ ...S.mTd(i), textAlign: 'left', paddingLeft: 28, color: '#94a3b8' }}>{action}</td>
                        <td style={S.mTd(i)}>{o ? '✅' : '❌'}</td>
                        <td style={S.mTd(i)}>{a ? '✅' : '❌'}</td>
                        <td style={S.mTd(i)}>{u ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </FadeIn>
        </div>
      </section>

      {/* ── SECTION 4: JWT ───────────────── */}
      <section style={S.sectionBig}>
        <div style={S.secInner}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={S.layerBadge('#f59e0b')}>🔄 LAYER 4</div>
              <h2 style={S.sectionTitle}>JWT + Refresh Token</h2>
              <p style={{ ...S.sectionDesc, maxWidth: 560, margin: '0 auto' }}>
                Silent refresh tự động — user không bao giờ bị logout giữa chừng.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 64 }}>
              {/* Timeline */}
              <div>
                <div style={S.timeline}>
                  {timelineSteps.map((step, i) => (
                    <div key={i} style={S.tlItem}>
                      <div style={S.tlLine}>
                        <div style={S.tlDot(step.color)}>{step.icon}</div>
                        {i < timelineSteps.length - 1 && <div style={S.tlConnector} />}
                      </div>
                      <div style={S.tlContent}>
                        <div style={S.tlTitle}>
                          <span style={{ fontFamily: 'monospace', color: step.color }}>
                            {String(i + 1).padStart(2, '0')}</span>
                          {' '}{step.title}
                        </div>
                        <div style={S.tlDesc}>{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Cards */}
              <div>
                <div style={{ fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Security Features</div>
                <div style={S.featureGrid}>
                  {[
                    { icon: '🍪', title: 'HttpOnly Cookie', desc: 'Refresh Token lưu trong HttpOnly Cookie. JavaScript không thể đọc → chống XSS hoàn toàn.' },
                    { icon: '🔁', title: 'Token Rotation', desc: 'Mỗi lần refresh tạo token mới. Token cũ bị revoke ngay lập tức.' },
                    { icon: '🚨', title: 'Reuse Detection', desc: 'Dùng token đã revoke → Phát hiện tấn công → Revoke TOÀN BỘ session của user.' },
                    { icon: '🛡️', title: 'SameSite=Strict', desc: 'Cookie chỉ gửi từ cùng domain. Chống CSRF attack hoàn toàn.' },
                  ].map(f => (
                    <div key={f.title} style={S.featureCard} className="sec-feature-card">
                      <div style={S.featureIcon}>{f.icon}</div>
                      <div style={S.featureTitle}>{f.title}</div>
                      <div style={S.featureDesc}>{f.desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 28, background: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: '20px', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>Axios Interceptor (api.js)</div>
                  <pre style={{ fontFamily: 'monospace', fontSize: 12, color: '#a78bfa', margin: 0 }}>{`// Auto-retry on 401
if (error.status === 401 && !_retry) {
  await axios.post('/refresh-token');
  return api(originalRequest); // Retry!
}`}</pre>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CUSTOM FOOTER ────────────────── */}
      <footer style={S.footer}>
        <div style={S.footerLine}>[ SCYTOL SECURITY SYSTEM v1.0 ]</div>
        <div style={S.footerLine}>[ Last Audit: March 2026 ]</div>
        <div style={{ ...S.footerLine, color: '#10b981', marginBottom: 28 }}>[ Status: ALL SYSTEMS OPERATIONAL ]</div>
        <div>
          {['ASP.NET Core', 'JWT', 'FluentValidation', 'SQL Server', 'SignalR', 'React'].map(t => (
            <span key={t} style={S.techBadge}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Security;
