import React from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import '../styles/CategoryPage.css';

const Mice = () => {
  const miceProducts = products.filter(p => p.category === 'mice');

  return (
    <div className="all-products-page cat-mice">
      <header className="all-products-header">
        <div className="container">
          <h1>GAMING MICE</h1>
          <p>Sức mạnh của sự chính xác trong tầm tay bạn.</p>
        </div>
      </header>

      <section className="all-products-content">
        <div className="container">
          <div className="products-grid">
            {miceProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-beige">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src={miceProducts[0]?.image} alt="Mice Info" />
          </div>
          <div className="info-text-side">
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
        </div>
      </section>

      <section className="category-info-section section-pastel-blue">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src="https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=1200" alt="Mouse Tech" />
          </div>
          <div className="info-text-side">
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
    </div>
  );
};

export default Mice;