import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import '../styles/CategoryPage.css';

const Accessories = () => {
  const accessoryProducts = products.filter(p => p.category === 'accessories');

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
            {accessoryProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="category-info-section section-pastel-beige">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src={accessoryProducts[0]?.image} alt="Accessories Info" />
          </div>
          <div className="info-text-side">
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
        </div>
      </section>

      <section className="category-info-section section-pastel-green">
        <div className="container category-info-container">
          <div className="info-image-side">
            <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1200" alt="Setup Tech" />
          </div>
          <div className="info-text-side">
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
    </div>
  );
};

export default Accessories;
