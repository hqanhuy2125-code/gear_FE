import React from 'react';
import BasePolicyPage from '../components/BasePolicyPage';

const ReturnPolicy = () => {
  return (
    <BasePolicyPage title="Chính sách đổi trả & Bảo hành">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1877F2' }}>1. Đổi trả trong 7 ngày</h2>
        <p>SCYTOL hỗ trợ đổi trả sản phẩm trong vòng **7 ngày** kể từ khi nhận hàng nếu sản phẩm lỗi do nhà sản xuất. Sản phẩm phải còn nguyên hộp, đầy đủ phụ kiện và không có dấu hiệu va đập, trầy xước từ phía người dùng.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1877F2' }}>2. Hoàn tiền 100%</h2>
        <p>Đối với các trường hợp lỗi do nhà sản xuất mà không có sản phẩm thay thế, SCYTOL cam kết hoàn lại **100% giá trị đơn hàng** cho quý khách.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1877F2' }}>3. Bảo hành 12 tháng</h2>
        <p>Tất cả sản phẩm gaming gear tại SCYTOL được bảo hành giới hạn **12 tháng**. Chúng tôi không bảo hành cho các trường hợp rơi vỡ, vào nước, cháy nổ hoặc tự ý can thiệp phần cứng.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#1877F2' }}>4. Quy trình thực hiện</h2>
        <p>Quý khách vui lòng liên hệ hotline hoặc nhắn tin qua Chatbox, cung cấp mã đơn hàng và tình trạng sản phẩm để được hỗ trợ nhanh nhất.</p>
      </section>
    </BasePolicyPage>
  );
};

export default ReturnPolicy;
