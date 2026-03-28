import React from 'react';
import ProductCard from '../components/ProductCard';
import { products as allProducts } from '../data/products';
import ProductPageAddons from '../components/ProductPageAddons';
import '../styles/CategoryPage.css';

const Headphones = () => {
  const products = allProducts.filter(p => p.category === 'headphones');
  const [visibleBlocks, setVisibleBlocks] = React.useState({});

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('animate-on-scroll')) {
          setVisibleBlocks(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-green">
        <div className="container category-info-container">
          <div id="text-1" className={`info-text-side animate-on-scroll slide-left ${visibleBlocks['text-1'] ? 'visible' : ''}`}>
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
          <div id="img-1" className={`info-image-side animate-on-scroll slide-right ${visibleBlocks['img-1'] ? 'visible' : ''}`}>
            <img src={products[0]?.image} alt="Headphones Info" />
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-beige">
        <div className="container category-info-container">
          <div id="img-2" className={`info-image-side animate-on-scroll slide-left ${visibleBlocks['img-2'] ? 'visible' : ''}`}>
            <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200" alt="Audio Tech" />
          </div>
          <div id="text-2" className={`info-text-side animate-on-scroll slide-right ${visibleBlocks['text-2'] ? 'visible' : ''}`}>
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

      <ProductPageAddons category="headphones" />
    </div>
  );
};

export default Headphones;
