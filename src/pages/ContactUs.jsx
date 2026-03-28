import React, { useState } from 'react';
import BasePolicyPage from '../components/BasePolicyPage';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Đang gửi...');
        setTimeout(() => {
            setStatus('Cảm ơn bạn! Thông tin đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.');
            e.target.reset();
        }, 1500);
    };

    return (
        <BasePolicyPage title="Liên hệ với chúng tôi">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Thông tin chi tiết</h2>
                    <p style={{ marginBottom: '30px', color: '#666' }}>Bạn có thắc mắc về sản phẩm hoặc đơn hàng? Đội ngũ hỗ trợ SCYTOL luôn sẵn sàng giải đáp.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '50%', color: '#1877F2' }}><Mail size={20} /></div>
                            <div>
                                <h4 style={{ margin: 0 }}>Email</h4>
                                <p style={{ margin: 0, color: '#666' }}>support@scytol.com</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '50%', color: '#1877F2' }}><Phone size={20} /></div>
                            <div>
                                <h4 style={{ margin: 0 }}>Hotline</h4>
                                <p style={{ margin: 0, color: '#666' }}>1900-SCYTOL (Miễn phí)</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '50%', color: '#1877F2' }}><MapPin size={20} /></div>
                            <div>
                                <h4 style={{ margin: 0 }}>Showroom</h4>
                                <p style={{ margin: 0, color: '#666' }}>Khu Công Nghệ Cao, TP. Thủ Đức, HCM</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', borderRadius: '12px', overflow: 'hidden', height: '250px', border: '1px solid #ddd' }}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m10!1m3!1d15674.444743232!2d106.772!3d10.844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUwJzM4LjQiTiAxMDbCsDQ2JzE5LjIiRQ!5e0!3m2!1svi!2s!4v1655648!5m2!1svi!2s" 
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                        ></iframe>
                    </div>
                </div>

                <div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Họ và tên</label>
                            <input required type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Địa chỉ Email</label>
                            <input required type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nội dung tin nhắn</label>
                            <textarea required rows={5} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
                        </div>
                        <button type="submit" style={{ 
                            background: '#1877F2', 
                            color: '#fff', 
                            padding: '14px', 
                            borderRadius: '8px', 
                            border: 'none', 
                            fontWeight: '700', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}>
                            <Send size={18} /> Gửi tin nhắn
                        </button>
                    </form>
                    {status && <p style={{ marginTop: '20px', padding: '15px', background: '#dcfce7', color: '#166534', borderRadius: '8px' }}>{status}</p>}
                </div>
            </div>
        </BasePolicyPage>
    );
};

export default ContactUs;
