import React from 'react';
import BasePolicyPage from '../components/BasePolicyPage';

const AboutUs = () => {
  return (
    <BasePolicyPage title="Giới thiệu SCYTOL CLX21">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#1877F2', marginBottom: '20px' }}>Nơi hội tụ Gear đỉnh cao</h2>
        <p>Thành lập từ năm 2024, **SCYTOL CLX21** tự hào là thương hiệu gaming gear cao cấp tại Việt Nam, mang đến những thiết bị ngoại vi đẳng cấp, giúp game thủ tận hưởng trải nghiệm mượt mà nhất.</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', margin: '40px 0' }}>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '10px' }}>Sứ mệnh</h3>
          <p>Cung cấp cho game thủ Việt những sản phẩm chính hãng, hiệu năng vượt trội với mức giá cạnh tranh nhất.</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '10px' }}>Chất lượng</h3>
          <p>Mỗi sản phẩm đều được kiểm tra kỹ lưỡng bởi đội ngũ kỹ thuật trước khi lên kệ, đảm bảo độ bền tối ưu.</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '10px' }}>Cộng đồng</h3>
          <p>Chúng tôi không chỉ bán Gear, chúng tôi xây dựng một sân chơi cho các tín đồ công nghệ và eSports.</p>
        </div>
      </div>

      <section>
        <p>Với hệ thống showroom hiện đại và dịch vụ hậu mãi chu đáo, SCYTOL CLX21 cam kết đồng hành cùng bạn trên mọi đấu trường ảo. Hãy để chúng tôi nâng tầm kỹ năng của bạn!</p>
      </section>
    </BasePolicyPage>
  );
};

export default AboutUs;
