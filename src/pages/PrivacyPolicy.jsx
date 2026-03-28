import React from 'react';
import BasePolicyPage from '../components/BasePolicyPage';

const PrivacyPolicy = () => {
  return (
    <BasePolicyPage title="Chính sách bảo mật">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>1. Thông tin chúng tôi thu thập</h2>
        <p>Tại SCYTOL CLX21, chúng tôi thu thập thông tin khi bạn đăng ký trên trang web, đặt hàng hoặc đăng ký nhận bản tin. Thông tin bao gồm tên, địa chỉ email, địa chỉ giao hàng và số điện thoại của bạn.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>2. Cách chúng tôi sử dụng thông tin</h2>
        <p>Thông tin thu thập được sử dụng để:</p>
        <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>Cá nhân hóa trải nghiệm của bạn (giúp chúng tôi đáp ứng tốt hơn nhu cầu cá nhân của bạn).</li>
          <li>Cải thiện trang web (chúng tôi liên tục nỗ lực cải thiện dịch vụ dựa trên thông tin và phản hồi từ bạn).</li>
          <li>Xử lý giao dịch (thông tin của bạn sẽ không bị bán, trao đổi hoặc chuyển nhượng cho bất kỳ công ty nào khác vì bất kỳ lý do gì).</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>3. Bảo mật dữ liệu</h2>
        <p>Chúng tôi thực hiện nhiều biện pháp bảo mật nâng cao để duy trì sự an toàn cho thông tin cá nhân của bạn. Tất cả thông tin nhạy cảm/thanh toán được truyền qua công nghệ Secure Socket Layer (SSL) mã hóa an toàn.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>4. Liên hệ</h2>
        <p>Nếu có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật này, bạn có thể liên hệ với chúng tôi qua trang Liên hệ.</p>
      </section>
    </BasePolicyPage>
  );
};

export default PrivacyPolicy;
