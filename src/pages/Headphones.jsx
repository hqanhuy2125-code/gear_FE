import React from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import '../styles/CategoryPage.css';

const Headphones = () => {
  const headphoneProducts = products.filter(p => p.category === 'headphones');

  return (
    <div className="all-products-page cat-headphones">
      <header className="all-products-header">
        <div className="container">
          <h1>AUDIO & HEADPHONES</h1>
          <p>Đắm chìm trong thế giới âm thanh sống động.</p>
        </div>
      </header>

      <section className="all-products-content section-white">
        <div className="container">
          <div className="products-grid">
            {headphoneProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-green">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src={headphoneProducts[0]?.image} alt="Headphones Info" />
          </div>
          <div className="info-text-side">
            <h2>Âm thanh vòm 7.1 sống động</h2>
            <p>
              Tai nghe SCYTOL mang đến trải nghiệm âm thanh không gian tuyệt vời, 
              giúp game thủ xác định chính xác vị trí kẻ địch thông qua tiếng bước chân 
              và tiếng súng. Driver âm thanh chất lượng cao tái tạo âm bass mạnh mẽ 
              và âm treble trong trẻo.
            </p>
            <p>
              Phần mềm Web Driver đi kèm cho phép bạn tinh chỉnh EQ theo sở thích 
              hoặc nhu cầu của từng tựa game cụ thể.
            </p>
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-beige">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200" alt="Audio Tech" />
          </div>
          <div className="info-text-side">
            <h2>Microphone chống ồn chuyên nghiệp</h2>
            <p>
              Giao tiếp là chìa khóa của chiến thắng. Microphone hướng tâm của chúng tôi 
              đã được tinh chỉnh để loại bỏ tạp âm xung quanh, đảm bảo giọng nói của bạn 
              luôn rõ ràng nhất trong combat.
            </p>
            <p>
              Thiết kế micro có thể tháo rời hoặc gập lại linh hoạt, biến chiếc tai nghe gaming 
              thành một chiếc tai nghe nghe nhạc thời trang chỉ trong tích tắc.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Headphones;
