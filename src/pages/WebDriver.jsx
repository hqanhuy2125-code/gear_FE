import React from 'react';
import '../styles/WebDriver.css';

const driverData = [
  {
    id: 1,
    name: "SCYTOL CLX21 Gaming Mouse Driver",
    version: "v1.2",
    date: "01/03/2025"
  },
  {
    id: 2,
    name: "SCYTOL CLX21 Mechanical Keyboard Driver",
    version: "v2.0",
    date: "25/02/2025"
  },
  {
    id: 3,
    name: "SCYTOL CLX21 Headset Control Software",
    version: "v1.5",
    date: "20/02/2025"
  }
];

const WebDriver = () => {
  return (
    <div className="driver-container">
      <header className="driver-header">
        <div className="container">
          <h1 className="driver-title">WEB DRIVER & SOFTWARE</h1>
          <div className="title-underline"></div>
          <p className="driver-subtitle">
            Tải xuống các phần mềm tùy chỉnh để tối ưu hóa vũ khí của bạn. 
            Mở khóa toàn bộ tiềm năng hiệu năng, tùy chỉnh đèn LED và thiết lập phím macro 
            cho các thiết bị SCYTOL.
          </p>
        </div>
      </header>

      <section className="section-white">
        <div className="container">
          <div className="driver-grid">
            {driverData.map((driver) => (
              <div key={driver.id} className="driver-card">
                <div className="driver-card-header">
                  <div className="driver-icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </div>
                  <div className="driver-title-area">
                    <h3>{driver.name}</h3>
                    <div className="driver-meta">
                      <span className="version-pill">Version {driver.version}</span>
                      <span className="date-text">Released: {driver.date}</span>
                    </div>
                  </div>
                </div>
                <p className="driver-description">
                  Tối ưu hóa hiệu suất và mở khóa các tính năng nâng cao cho thiết bị của bạn. 
                  Bản cập nhật này bao gồm các bản sửa lỗi và cải thiện độ ổn định.
                </p>
                <div className="driver-card-footer">
                  <button className="download-cta">
                    <span>Tải xuống ngay</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="driver-info-section section-gray">
        <div className="container driver-info-container">
          <div className="driver-info-image">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="Software Central" />
          </div>
          <div className="driver-info-text">
            <h2>Phần mềm & Drivers SCYTOL</h2>
            <p>
              Để đạt được hiệu năng tối đa từ thiết bị SCYTOL của bạn, việc cài đặt Driver và phần mềm đi kèm 
              là điều cực kỳ quan trọng. Phần mềm của chúng tôi cho phép bạn can thiệp sâu vào các thiết lập 
              kỹ thuật mà phần cứng thông thường không thể làm được.
            </p>
            <p>
              Từ việc điều chỉnh DPI từng mức nhỏ, thiết lậpPolling Rate đến việc đồng bộ hóa ánh sáng 
              RGB theo âm nhạc hoặc hành động trong game, mọi thứ đều nằm trong tầm tay bạn. 
              Chúng tôi liên tục cập nhật các bản vá lỗi và tính năng mới để đảm bảo thiết bị luôn hoạt động ổn định.
            </p>
            <p>
              Hãy đảm bảo bạn luôn sử dụng phiên bản driver mới nhất để trải nghiệm những công nghệ 
              đột phá và tính năng bảo mật mới nhất từ đội ngũ kỹ sư SCYTOL.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDriver;
