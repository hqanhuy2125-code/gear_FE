import React from 'react';
import BasePolicyPage from '../components/BasePolicyPage';

const TermsOfService = () => {
  return (
    <BasePolicyPage title="Điều khoản dịch vụ">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>1. Chấp nhận các điều khoản</h2>
        <p>Bằng việc truy cập và sử dụng trang web của SCYTOL CLX21, bạn đồng ý tuân thủ các Điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>2. Quyền sở hữu trí tuệ</h2>
        <p>Tất cả nội dung trên trang web, bao gồm văn bản, hình ảnh, logo và phần mềm, đều thuộc sở hữu của SCYTOL CLX21 và được bảo vệ bởi luật sở hữu trí tuệ.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>3. Trách nhiệm người dùng</h2>
        <p>Người dùng cam kết cung cấp thông tin chính xác khi đặt hàng và không sử dụng trang web cho bất kỳ mục đích vi phạm pháp luật nào.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>4. Thay đổi điều khoản</h2>
        <p>Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào mà không cần thông báo trước. Việc bạn tiếp tục sử dụng web đồng nghĩa với việc chấp nhận các thay đổi đó.</p>
      </section>
    </BasePolicyPage>
  );
};

export default TermsOfService;
