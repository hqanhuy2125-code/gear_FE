import React from 'react';
import '../styles/Blog.css';

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Chuột Gaming Tốt Nhất 2025",
    description: "Những mẫu chuột gaming được game thủ ưa chuộng nhất hiện nay.",
    date: "10/03/2025",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb552f41?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Cách Chọn Bàn Phím Cơ Phù Hợp Cho Game Thủ",
    description: "Hướng dẫn chọn switch, layout và độ bền cho bàn phím cơ.",
    date: "08/03/2025",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Mousepad Ảnh Hưởng Đến Hiệu Năng Game Như Thế Nào?",
    description: "So sánh mousepad speed và control dành cho FPS game.",
    date: "05/03/2025",
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800"
  }
];

const Blog = () => {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <div className="container">
          <h1 className="blog-title">TIN TỨC & BÀI VIẾT</h1>
          <div className="title-underline"></div>
          <p className="blog-subtitle">
            Nơi chia sẻ những tin tức công nghệ mới nhất, bí quyết chọn gaming gear 
            và những đánh giá chi tiết về hệ sinh thái sản phẩm SCYTOL.
          </p>
        </div>
      </header>
      
      <section className="section-white">
        <div className="container blog-grid">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-card">
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} className="blog-image" />
                <div className="blog-date">{post.date}</div>
              </div>
              <div className="blog-content">
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-post-desc">{post.description}</p>
                <button className="read-more-btn">Đọc chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="blog-info-section section-gray">
        <div className="container blog-info-container">
          <div className="blog-info-image">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800" alt="Technology Insights" />
          </div>
          <div className="blog-info-text">
            <h2>Kiến thức & Chia sẻ từ SCYTOL</h2>
            <p>
              Tại SCYTOL, chúng tôi không chỉ cung cấp thiết bị mà còn mong muốn xây dựng một cộng đồng 
              game thủ am hiểu và đam mê công nghệ. Những bài viết của chúng tôi tập trung vào việc 
              cung cấp kiến thức chuyên sâu về phần cứng.
            </p>
            <p>
              Từ những hướng dẫn chi tiết về cách bảo quản bàn phím cơ, đến những phân tích kỹ thuật về 
              tần số quét của chuột gaming, SCYTOL Blog là nơi bạn tìm thấy mọi thông tin cần thiết 
              để tối ưu hóa bộ máy chiến đấu của mình.
            </p>
            <p>
              Hãy cùng chúng tôi cập nhật những xu hướng công nghệ mới nhất và khám phá những mẹo nhỏ 
              nhưng hữu dụng giúp bạn luôn dẫn đầu trong mọi trận chơi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
