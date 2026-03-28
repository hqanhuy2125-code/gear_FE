import React from 'react';
import BasePolicyPage from '../components/BasePolicyPage';

const ShippingPolicy = () => {
  return (
    <BasePolicyPage title="Chính sách vận chuyển">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>1. Thời gian giao hàng</h2>
        <p>SCYTOL xử lý đơn hàng nhanh chóng ngay trong ngày (đối với đơn trước 16h). Thời gian nhận hàng dự kiến:</p>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li><strong>Khu vực Nội thành (Hà Nội/HCM):</strong> 1-2 ngày làm việc.</li>
          <li><strong>Các tỉnh thành khác:</strong> 2-5 ngày làm việc.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>2. Cước phí vận chuyển</h2>
        <p>Chúng tôi áp dụng phí vận chuyển linh hoạt theo vị trí địa lý. Đặc biệt, **Miễn phí vận chuyển (Free Ship)** cho tất cả đơn hàng có giá trị từ **500,000 ₫** trở lên.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>3. Đối tác vận chuyển</h2>
        <p>SCYTOL hợp tác với các đơn vị vận chuyển uy tín như Giao Hàng Tiết Kiệm (GHTK), Viettel Post và J&T Express để đảm bảo gear của bạn được nâng niu an toàn nhất.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>4. Theo dõi đơn hàng</h2>
        <p>Mỗi đơn hàng sau khi xuất kho sẽ có mã vận đơn được gửi qua email. Bạn cũng có thể theo dõi trực tiếp trong phần **Đơn hàng của tôi** trong Profile.</p>
      </section>
    </BasePolicyPage>
  );
};

export default ShippingPolicy;
