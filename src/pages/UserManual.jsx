import React from 'react';
import BasePolicyPage from '../components/BasePolicyPage';

const UserManual = () => {
  return (
    <BasePolicyPage title="Hướng dẫn sử dụng website">
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1877F2', marginBottom: '15px' }}>1. Đăng ký & Đăng nhập</h2>
        <p>Để tận hưởng trọn vẹn dịch vụ, bạn nên tạo tài khoản qua mục **Login / Sign Up**. Tài khoản giúp bạn lưu sản phẩm yêu thích và quản lý giỏ hàng trên nhiều thiết bị.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1877F2', marginBottom: '15px' }}>2. Đặt hàng & Thanh toán</h2>
        <p>Chọn sản phẩm, tùy chỉnh số lượng và nhấn **Thêm vào giỏ hàng**. Tại trang Giỏ hàng, bạn có thể kiểm tra lại Gear của mình rồi tiến hành **Thanh toán**. Chúng tôi hỗ trợ nhiều hình thức: COD, MoMo, VNPay.</p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1877F2', marginBottom: '15px' }}>3. Theo dõi đơn hàng</h2>
        <p>Mỗi khi có thay đổi trạng thái đơn hàng (đã xác nhận, đang giao, hoàn thành), hệ thống sẽ gửi thông báo. Bạn có thể xem chi tiết trong mục **Đơn hàng của tôi** ở Profile.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', color: '#1877F2', marginBottom: '15px' }}>4. Đổi trả an tâm</h2>
        <p>Nếu Gear có vấn đề, hãy truy cập **Chính sách đổi trả** để xem hướng dẫn. Bạn có thể chat trực tiếp với Admin qua Chatbox thông minh (phía dưới bên phải) để được giải quyết nhanh nhất.</p>
      </section>
    </BasePolicyPage>
  );
};

export default UserManual;
