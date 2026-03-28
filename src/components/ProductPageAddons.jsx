import React, { useState } from 'react';
import { 
  Keyboard, MousePointer2, Headphones, Sparkles, 
  ShieldCheck, RefreshCcw, Truck, CheckCircle2,
  ChevronDown, Cpu, Zap, Wifi, Volume2, Mic2, Layers,
  Activity, Settings
} from 'lucide-react';
import '../styles/ProductPageAddons.css';

const categoryData = {
  keyboards: {
    features: [
      { icon: <Cpu />, title: 'Scytol Switches', desc: 'Sử dụng switch cơ học hotswap 3/5-pin, cho cảm giác gõ đầm và bền bỉ.' },
      { icon: <Sparkles />, title: 'RGB Hệ Mặt Trời', desc: 'Hệ thống LED 16.8 triệu màu, tùy chỉnh vô hạn qua phần mềm chuyên dụng.' },
      { icon: <Wifi />, title: 'Kết nối Triple Mode', desc: 'Chuyển đổi linh hoạt giữa Bluetooth 5.1, Wireless 2.4G và Type-C.' }
    ],
    faqs: [
      { q: 'Bàn phím có tính năng Hotswap không?', a: 'Có, tất cả các dòng bàn phím SCYTOL đều hỗ trợ Hotswap 5-pin, cho phép bạn thay thế switch dễ dàng mà không cần hàn.' },
      { q: 'Làm sao để tùy chỉnh đèn LED?', a: 'Bạn có thể chỉnh trực tiếp qua phím tắt Fn hoặc tải Scytol Control Center để tùy biến sâu hơn.' },
      { q: 'Pin dùng được bao lâu ở chế độ không dây?', a: 'Với dung lượng pin từ 4000mAh, bạn có thể sử dụng lên đến 200 giờ (tắt LED) và 40 giờ (bật LED).' },
      { q: 'Sản phẩm có đi kèm keycap puller không?', a: 'Có, mỗi hộp sản phẩm đều tặng kèm 1 keycap puller và 1 switch puller cao cấp.' }
    ]
  },
  mice: {
    features: [
      { icon: <Activity />, title: 'Cảm biến 26K DPI', desc: 'Mắt đọc PAW3395 đỉnh cao, mang lại độ chính xác tuyệt đối trong từng cú vẩy.' },
      { icon: <Zap />, title: '8000Hz Polling Rate', desc: 'Tốc độ phản hồi siêu tốc 0.125ms, xóa nhòa khoảng cách giữa có dây và không dây.' },
      { icon: <Settings />, title: 'Thiết kế Ergofit', desc: 'Form cầm được nghiên cứu kỹ lưỡng, phù hợp với mọi kiểu cầm Palm, Claw hay Fingertip.' }
    ],
    faqs: [
      { q: 'Chuột nặng bao nhiêu gram?', a: 'Các dòng chuột gaming của chúng tôi được tối ưu trọng lượng siêu nhẹ, dao động từ 49g đến 63g.' },
      { q: 'Chân chuột làm bằng chất liệu gì?', a: 'Chúng tôi sử dụng 100% nhựa PTFE nguyên chất, giúp chuột lướt êm ái trên mọi bề mặt lót chuột.' },
      { q: 'Có thể thay thay đổi LOD (Lift-off Distance) không?', a: 'Có, bạn có thể điều chỉnh LOD qua phần mềm từ 1.0mm đến 2.0mm để phù hợp với thói quen chơi game.' },
      { q: 'Switch chuột có bền không?', a: 'SCYTOL sử dụng switch Huano hoặc Kailh GM 8.0 với tuổi thọ lên đến 80 triệu lần nhấn.' }
    ]
  },
  headphones: {
    features: [
      { icon: <Layers />, title: 'Âm thanh vòm 7.1', desc: 'Định vị chính xác tiếng bước chân và tiếng súng trong không gian 3D.' },
      { icon: <Mic2 />, title: 'Micro ENC Lọc Ồn', desc: 'Thu âm trong trẻo, loại bỏ đến 90% tạp âm môi trường xung quanh.' },
      { icon: <Volume2 />, title: 'Driver 50mm Graphene', desc: 'Màng loa cao cấp cho âm Bass mạnh mẽ và Treble cực kỳ chi tiết.' }
    ],
    faqs: [
      { q: 'Tai nghe có dùng được cho PS5 hay Xbox không?', a: 'Có, sản phẩm hỗ trợ đa nền tảng qua kết nối Jack 3.5mm hoặc USB Dongle.' },
      { q: 'Đệm tai có thay thế được không?', a: 'Có, đệm tai được thiết kế dạng khớp cài, bạn có thể dễ dàng tháo ra để vệ sinh hoặc thay mới.' },
      { q: 'Micro có thể tháo rời không?', a: 'Đa số các dòng tai nghe SCYTOL đều có micro tháo rời hoặc thu gọn linh hoạt.' },
      { q: 'Có cần cài driver để dùng âm thanh 7.1 không?', a: 'Bạn chỉ cần cắm USB Dongle là có thể dùng 7.1 cơ bản, cài thêm app để tùy chỉnh EQ chi tiết.' }
    ]
  },
  accessories: {
    features: [
      { icon: <ShieldCheck />, title: 'Chất lượng cao cấp', desc: 'Sử dụng vật liệu bền bỉ, được kiểm soát chất lượng nghiêm ngặt.' },
      { icon: <CheckCircle2 />, title: 'Tương thích 100%', desc: 'Sản phẩm được thiết kế để hoạt động hoàn hảo với mọi hệ sinh thái gaming.' },
      { icon: <RefreshCcw />, title: 'Bảo hành chính hãng', desc: 'Yên tâm sử dụng với chế độ bảo hành 12 tháng từ SCYTOL CLX21.' }
    ],
    faqs: [
      { q: 'Lót chuột có giặt được không?', a: 'Có, bạn có thể giặt nhẹ bằng tay với xà phòng trung tính và phơi khô tự nhiên.' },
      { q: 'Giá treo tai nghe có chắc chắn không?', a: 'Sản phẩm được làm từ hợp kim nhôm hoặc nhựa ABS chịu lực, có đế chống trượt cực kỳ ổn định.' },
      { q: 'Túi đựng bàn phím có kích thước như thế nào?', a: 'Chúng tôi có đủ size cho bàn phím 60%, 75%, TKL và Fullsize.' },
      { q: 'Sản phẩm này có được freeship không?', a: 'Mọi đơn hàng phụ kiện từ 500,000 ₫ đều được miễn phí vận chuyển toàn quốc.' }
    ]
  }
};

const ProductPageAddons = ({ category }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const data = categoryData[category] || categoryData.accessories;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ppa-container">
      {/* Section 1: Features */}
      <section className="ppa-features">
        <div className="ppa-features-grid">
          {data.features.map((f, i) => (
            <div key={i} className="ppa-feature-card">
              <div className="ppa-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Promo Banner */}
      <section className="ppa-promo-banner">
        <div className="ppa-promo-content">
          <h2>MIỄN PHÍ VẬN CHUYỂN cho đơn từ 500.000 ₫ 🚚</h2>
          <button className="ppa-promo-btn" onClick={scrollToTop}>Mua ngay bây giờ</button>
        </div>
      </section>

      {/* Section 3: Brand Commitment */}
      <section className="ppa-commitment">
        <div className="ppa-commitment-grid">
          <div className="ppa-commit-item">
            <ShieldCheck size={32} color="#1877F2" />
            <span>Bảo hành 12 tháng</span>
          </div>
          <div className="ppa-commit-item">
            <RefreshCcw size={32} color="#1877F2" />
            <span>Đổi trả trong 7 ngày</span>
          </div>
          <div className="ppa-commit-item">
            <Truck size={32} color="#1877F2" />
            <span>Giao hàng toàn quốc</span>
          </div>
          <div className="ppa-commit-item">
            <CheckCircle2 size={32} color="#1877F2" />
            <span>Hàng chính hàng 100%</span>
          </div>
        </div>
      </section>

      {/* Section 4: FAQ */}
      <section className="ppa-faq">
        <h2>Câu hỏi thường gặp</h2>
        <div className="ppa-faq-list">
          {data.faqs.map((faq, i) => (
            <div key={i} className={`ppa-faq-item ${activeFaq === i ? 'active' : ''}`}>
              <button 
                className="ppa-faq-question" 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className="ppa-faq-icon" size={20} />
              </button>
              <div className="ppa-faq-answer">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPageAddons;
