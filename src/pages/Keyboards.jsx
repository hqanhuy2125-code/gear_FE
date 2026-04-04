import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPageAddons from '../components/ProductPageAddons';
import '../styles/CategoryPage.css';

const API_BASE = 'http://localhost:5130';

const Keyboards = () => {
  const [products, setProducts] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/api/products?pageSize=100`)
      .then(res => res.json())
      .then(data => {
        const prods = data.items || [];
        setProducts(prods.map(p => ({ ...p, image: p.imageUrl })).filter(p => (p.category || '').toLowerCase() === 'keyboards'));
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
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-blue">
        <div className="container category-info-container">
          <div id="text-1" className={`info-text-side animate-on-scroll slide-left ${visibleBlocks['text-1'] ? 'visible' : ''}`}>
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
          <div id="img-1" className={`info-image-side animate-on-scroll slide-right ${visibleBlocks['img-1'] ? 'visible' : ''}`}>
            <img src={products[0]?.image} alt="Keyboards Info" />
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-purple">
        <div className="container category-info-container">
          <div id="img-2" className={`info-image-side animate-on-scroll slide-left ${visibleBlocks['img-2'] ? 'visible' : ''}`}>
            <img src="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1200" alt="Keyboard Tech" />
          </div>
          <div id="text-2" className={`info-text-side animate-on-scroll slide-right ${visibleBlocks['text-2'] ? 'visible' : ''}`}>
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

      <ProductPageAddons category="keyboards" />
    </div>
  );
};

export default Keyboards;
