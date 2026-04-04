import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductPageAddons from '../components/ProductPageAddons';
import '../styles/CategoryPage.css';

const API_BASE = 'http://localhost:5130';

const Mice = () => {
  const [products, setProducts] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/api/products?pageSize=100`)
      .then(res => res.json())
      .then(data => {
        const prods = data.items || [];
        setProducts(prods.map(p => ({ ...p, image: p.imageUrl })).filter(p => (p.category || '').toLowerCase() === 'mice'));
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
    <div className="all-products-page cat-mice">
      <header className="all-products-header">
        <div className="container">
          <h1>GAMING MICE</h1>
          <p>Sức mạnh của sự chính xác trong tầm tay bạn.</p>
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
            <h2>Cảm biến quang học 26K đỉnh cao</h2>
            <p>
              Chuột gaming SCYTOL sở hữu cảm biến quang học tiên tiến nhất thế giới, 
              mang lại độ chính xác từng pixel và khả năng theo dõi mượt mà trên 
              mọi bề mặt. Mọi cú click đều được thực hiện ngay lập tức với độ trễ 
              gần như bằng không.
            </p>
            <p>
              Thiết kế công thái học giúp giảm mỏi tay trong những phiên chơi game 
              kéo dài, cho phép bạn duy trì phong độ đỉnh cao lâu hơn.
            </p>
          </div>
          <div id="img-1" className={`info-image-side animate-on-scroll slide-right ${visibleBlocks['img-1'] ? 'visible' : ''}`}>
            <img src={products[0]?.image} alt="Mice Info" />
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-blue">
        <div className="container category-info-container">
          <div id="img-2" className={`info-image-side animate-on-scroll slide-left ${visibleBlocks['img-2'] ? 'visible' : ''}`}>
            <img src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=1200" alt="Mouse Tech" />
          </div>
          <div id="text-2" className={`info-text-side animate-on-scroll slide-right ${visibleBlocks['text-2'] ? 'visible' : ''}`}>
            <h2>Trọng lượng siêu nhẹ, tốc độ siêu nhanh</h2>
            <p>
              Chúng tôi hiểu rằng trong thi đấu, tốc độ là tất cả. Với việc sử dụng 
              vật liệu composite cao cấp, chuột SCYTOL đạt được trọng lượng cực nhẹ 
              mà vẫn giữ được độ cứng cáp hoàn hảo.
            </p>
            <p>
              Công nghệ feet chuột PTFE 100% nguyên chất giúp chuột lướt êm ái 
              như bay trên mặt lót chuột, tạo nên lợi thế không nhỏ trong các tình huống 
              vẩy chuột nhanh.
            </p>
          </div>
        </div>
      </section>

      <ProductPageAddons category="mice" />
    </div>
  );
};

export default Mice;