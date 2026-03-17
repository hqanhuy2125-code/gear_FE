import React from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import '../styles/CategoryPage.css';

const Keyboards = () => {
  const keyboardProducts = products.filter(p => p.category === 'keyboards');

  return (
    <div className="all-products-page cat-keyboards">
      <header className="all-products-header">
        <div className="container">
          <h1>KEYBOARDS</h1>
          <p>Khám phá bộ sưu tập bàn phím cơ đỉnh cao từ SCYTOL.</p>
        </div>
      </header>

      <section className="all-products-content section-white">
        <div className="container">
          <div className="products-grid">
            {keyboardProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-blue">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src={keyboardProducts[0]?.image} alt="Keyboards Info" />
          </div>
          <div className="info-text-side">
            <h2>Trải nghiệm gõ phím đỉnh cao</h2>
            <p>
              Bàn phím cơ SCYTOL được thiết kế dành riêng cho những game thủ 
              đòi hỏi sự chính xác tuyệt đối và cảm giác gõ phím hoàn hảo. 
              Với công nghệ switch hotswap tiên tiến, bạn có thể dễ dàng 
              tùy chỉnh bàn phím theo phong cách của riêng mình.
            </p>
            <p>
              Hệ thống đèn LED RGB rực rỡ kết hợp với chất liệu vỏ cao cấp 
              không chỉ mang lại vẻ đẹp ấn tượng mà còn đảm bảo độ bền 
              vượt trội qua hàng triệu lần nhấn.
            </p>
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-purple">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1200" alt="Keyboard Tech" />
          </div>
          <div className="info-text-side">
            <h2>Kết nối không dây siêu tốc</h2>
            <p>
              Đừng để dây cáp làm phiền bạn. Các sản phẩm bàn phím của chúng tôi 
              hỗ trợ kết nối Triple Mode (Bluetooth, 2.4GHz không dây và USB-C), 
              giúp bạn linh hoạt chuyển đổi giữa các thiết bị một cách dễ dàng.
            </p>
            <p>
              Công nghệ kết nối không dây độc quyền đảm bảo tốc độ phản hồi 
              tương đương với kết nối có dây, giúp bạn luôn làm chủ cuộc chơi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Keyboards;
