import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPageAddons from '../components/ProductPageAddons';
import '../styles/CategoryPage.css';

const API_BASE = 'http://localhost:5130';

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/api/products?pageSize=100`)
      .then(res => res.json())
      .then(data => {
        const prods = data.items || [];
        setProducts(prods.map(p => ({ ...p, image: p.imageUrl })).filter(p => (p.category || '').toLowerCase() === 'accessories'));
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
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
    <div className="all-products-page cat-accessories">
      <header className="all-products-header">
        <div className="container">
          <h1>GAMING ACCESSORIES</h1>
          <p>Mảnh ghép cuối cùng cho góc máy hoàn hảo của bạn.</p>
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

      <section className="category-info-section section-pastel-beige">
        <div className="container category-info-container">
          <div id="text-1" className={`info-text-side animate-on-scroll slide-left ${visibleBlocks['text-1'] ? 'visible' : ''}`}>
            <h2>Phụ kiện hỗ trợ tối ưu</h2>
            <p>
              Từ lót chuột bề mặt cao cấp đến các phụ kiện trang trí, SCYTOL cung cấp 
              mọi thứ bạn cần để tối ưu hóa góc làm việc và giải trí của mình. 
              Chúng tôi chăm chút đến từng chi tiết nhỏ nhất để đảm bảo sự đồng bộ 
              về thẩm mỹ và hiệu năng.
            </p>
            <p>
              Vật liệu chống trượt, dễ dàng vệ sinh và độ bền cực cao là những tiêu chuẩn 
              bắt buộc trên mọi sản phẩm phụ kiện của chúng tôi.
            </p>
          </div>
          <div id="img-1" className={`info-image-side animate-on-scroll slide-right ${visibleBlocks['img-1'] ? 'visible' : ''}`}>
            <img src={products[0]?.image} alt="Accessories Info" />
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-green">
        <div className="container category-info-container">
          <div id="img-2" className={`info-image-side animate-on-scroll slide-left ${visibleBlocks['img-2'] ? 'visible' : ''}`}>
            <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1200" alt="Setup Tech" />
          </div>
          <div id="text-2" className={`info-text-side animate-on-scroll slide-right ${visibleBlocks['text-2'] ? 'visible' : ''}`}>
            <h2>Tạo phong cách riêng cho góc máy</h2>
            <p>
              Góc gaming không chỉ là nơi chơi game, đó còn là nơi thể hiện cá tính của bạn. 
              Các phụ kiện của SCYTOL được thiết kế với ngôn ngữ tối giản, hiện đại, 
              giúp dễ dàng phối hợp với bất kỳ không gian phòng nào.
            </p>
            <p>
              Hãy để chúng tôi giúp bạn biến giấc mơ về một góc máy trong mơ 
              trở thành hiện thực.
            </p>
          </div>
        </div>
      </section>

      <ProductPageAddons category="accessories" />
    </div>
  );
};

export default Accessories;
