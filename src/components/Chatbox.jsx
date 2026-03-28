import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Loader2, Bot, Headset, User, Trash2 } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import '../styles/Chatbox.css';



const Chatbox = () => {
  const user = JSON.parse(localStorage.getItem("user") || localStorage.getItem("userInfo") || "null");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('AI'); // 'AI' or 'SUPPORT'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Mình là SCYTOL AI. ✨ Mình có thể giúp gì cho bạn? Nếu cần gặp trực tiếp nhân viên, hãy nhấn nút "Hỗ trợ" nhé!' }
  ]);
  const [supportMessages, setSupportMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connection, setConnection] = useState(null);
  const [isAdminOnline, setIsAdminOnline] = useState(true);
  const messagesEndRef = useRef(null);

  // Load history from session for AI mode
  useEffect(() => {
    const saved = sessionStorage.getItem('ai_chat_history');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
        sessionStorage.setItem('ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // SignalR for Support Mode
  useEffect(() => {
    if (mode === 'SUPPORT' && user?.id) {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5130/hubs/chat")
            .withAutomaticReconnect()
            .build();

        conn.on("ReceiveMessage", (msg) => {
            setSupportMessages(prev => [...prev, { 
                role: msg.isAdminSender ? 'assistant' : 'user', 
                content: msg.message,
                time: msg.createdAt
            }]);
        });

        conn.start()
            .then(() => {
                conn.invoke("JoinChat", user.id, false);
                setConnection(conn);
                // Fetch history
                fetch(`http://localhost:5130/api/chat/history/${user.id}`)
                    .then(res => res.json())
                    .then(data => {
                        setSupportMessages(data.map(m => ({
                            role: m.isAdminSender ? 'assistant' : 'user',
                            content: m.message,
                            time: m.createdAt
                        })));
                    });
            })
            .catch(err => console.error("ChatHub error:", err));

        return () => conn.stop();
    }
  }, [mode, user?.id]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (forcedMessage = null) => {
    const userMessage = forcedMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!forcedMessage) setInput('');

    if (mode === 'SUPPORT') {
        if (connection) {
            await connection.invoke("SendMessageToAdmin", user?.id || 0, userMessage);
        }
        return;
    }

    // AI Mode - Rule-based Response (No API)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate thinking/typing delay
    setTimeout(() => {
      let responseText = "";
      const inputLower = userMessage.toLowerCase();

      // Common suggestions logic
      if (inputLower.includes("chuột") && inputLower.includes("tư vấn")) {
        responseText = "SCYTOL có các dòng chuột siêu nhẹ eSports (49g-55g), mắt đọc PAW3395 cực nhạy. Bạn thích chơi game FPS hay MOBA để mình gợi ý nhé? 🖱️";
      }
      else if (inputLower.includes("bàn phím") && inputLower.includes("tư vấn")) {
        responseText = "Shop đang có sẵn các mẫu bàn phím cơ Hall Effect (Switch nam châm) phản hồi siêu nhanh cho game thủ đỉnh cao. Bạn cần phím mini 60% hay fullsize? ⌨️";
      }
      else if (inputLower.includes("tai nghe") && inputLower.includes("tư vấn")) {
        responseText = "Tai nghe bên shop hỗ trợ âm thanh vòm 7.1, mic lọc ồn cực tốt. Bạn quan tâm dòng có dây hay không dây (Wireless)? 🎧";
      }
      else if (inputLower.includes("chính sách giao hàng") || inputLower.includes("ship")) {
        responseText = "SCYTOL giao hàng toàn quốc từ 2-5 ngày. Miễn phí vận chuyển cho mọi đơn hàng từ 500k trở lên nhé! 🚚";
      }
      else if (inputLower.includes("theo dõi đơn hàng") || inputLower.includes("track")) {
        responseText = "Để theo dõi đơn hàng, bạn vui lòng đăng nhập, vào mục 'Đơn hàng' trong Profile để xem trạng thái vận chuyển trực tiếp nhé! 📦";
      }
      else if (inputLower.includes("khuyến mãi") || inputLower.includes("sale")) {
        responseText = "Hiện SCYTOL đang có chương trình Flash Sale hàng tuần giảm tới 30% cho nhiều mẫu phím và chuột hot. Bạn vào trang Sale để xem chi tiết nhé! 🔥";
      }
      // Specific Suggestions (from previous version if still needed)
      else if (inputLower.includes("driver") || inputLower.includes("phần mềm")) {
        responseText = "Bạn có thể tải Driver mới nhất cho tất cả thiết bị tại trang [Hỗ trợ phần mềm](/#/driver) của SCYTOL nhé! 🖱️🖱️";
      }
      // General categories
      else if (inputLower.includes("giá") || inputLower.includes("mua") || inputLower.includes("sản phẩm") || 
          inputLower.includes("chuột") || inputLower.includes("phím") || inputLower.includes("tai nghe") || inputLower.includes("màn hình")) {
        responseText = "Bạn đang quan tâm sản phẩm nào? SCYTOL có: 🖱️ Chuột gaming, ⌨️ Bàn phím, 🎧 Tai nghe, 🖥️ Màn hình. Bạn có thể xem thêm tại trang danh mục nhé!";
      } 
      else if (inputLower.includes("giao hàng") || inputLower.includes("vận chuyển") || inputLower.includes("ship")) {
        responseText = "SCYTOL giao hàng toàn quốc 2-5 ngày làm việc. Miễn phí ship cho đơn từ 500k! 🚚";
      }
      else if (inputLower.includes("đổi trả") || inputLower.includes("bảo hành")) {
        responseText = "SCYTOL bảo hành 12 tháng cho tất cả sản phẩm. Đổi trả miễn phí trong 7 ngày nếu lỗi nhà sản xuất! 🛡️";
      }
      else if (inputLower.includes("thanh toán") || inputLower.includes("cod") || inputLower.includes("momo") || inputLower.includes("vnpay")) {
        responseText = "SCYTOL hỗ trợ: COD (tiền mặt), chuyển khoản, MoMo và VNPay. An toàn và tiện lợi! 💳";
      }
      else if (inputLower.includes("khuyến mãi") || inputLower.includes("sale") || inputLower.includes("voucher")) {
        responseText = "Hiện SCYTOL đang có chương trình Flash Sale hàng tuần! Theo dõi trang Sale để không bỏ lỡ deal hot nhé 🔥";
      }
      else if (inputLower.includes("tài khoản") || inputLower.includes("đăng ký")) {
        responseText = "Bạn có thể đăng ký tài khoản để theo dõi đơn hàng, tích điểm và nhận ưu đãi độc quyền! 👤";
      }
      else if (inputLower.includes("liên hệ") || inputLower.includes("hỗ trợ") || inputLower.includes("gặp nhân viên")) {
        responseText = "Bạn có thể nhấn nút 'Hỗ trợ' phía trên để chat trực tiếp với nhân viên, hoặc email support@scytol.com nhé! 📞";
      }
      else if (inputLower.includes("hello") || inputLower.includes("hi") || inputLower.includes("xin chào") || inputLower.includes("chào")) {
        responseText = "Xin chào! Mình là SCYTOL AI 👋 Mình có thể tư vấn sản phẩm, giao hàng, bảo hành cho bạn. Bạn cần hỗ trợ gì?";
      }
      else if (inputLower.includes("cảm ơn") || inputLower.includes("thank")) {
        responseText = "Không có gì! Chúc bạn mua sắm vui vẻ tại SCYTOL 😊 Nếu cần thêm hỗ trợ cứ nhắn mình nhé!";
      }
      else {
        responseText = "Mình chưa hiểu câu hỏi của bạn 😅 Bạn có thể hỏi về: sản phẩm, giao hàng, bảo hành, thanh toán hoặc nhấn 'Hỗ trợ' để gặp nhân viên nhé!";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      setIsLoading(false);
    }, 500);
  };

  const clearChat = () => {
    if (mode === 'AI') {
        if (window.confirm("Bạn có muốn xóa toàn bộ lịch sử chat không?")) {
            setMessages([{ role: 'assistant', content: 'Xin chào! Mình là SCYTOL AI. ✨ Mình có thể giúp gì cho bạn? Nếu cần gặp trực tiếp nhân viên, hãy nhấn nút "Hỗ trợ" nhé!' }]);
            sessionStorage.removeItem('ai_chat_history');
        }
    }
  };

  return (
    <>
      <button className={`chat-fab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="ch-content">
            <h3>Chat với chúng tôi</h3>
            <p>Xin chào! 👋 Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy nhắn tin bất cứ lúc nào!</p>
          </div>
          <div className="ch-actions">
            {mode === 'AI' && (
              <button 
                title="Xóa lịch sử chat" 
                className="ch-mode-toggle ch-trash" 
                onClick={clearChat}
              >
                <Trash2 size={18} />
              </button>
            )}
            <button 
                title={mode === 'AI' ? "Chat với người" : "Chat với AI"} 
                className={`ch-mode-toggle ${mode === 'SUPPORT' ? 'active' : ''}`} 
                onClick={() => {
                    if (mode === 'AI' && !user) {
                        alert("Vui lòng đăng nhập để sử dụng tính năng hỗ trợ trực tuyến!");
                        return;
                    }
                    setMode(mode === 'AI' ? 'SUPPORT' : 'AI');
                }}
            >
                {mode === 'AI' ? <><Headset size={18} /> <span style={{fontSize: '0.7rem', marginLeft: '5px'}}>Hỗ trợ</span></> : <><Bot size={18} /> <span style={{fontSize: '0.7rem', marginLeft: '5px'}}>AI Chat</span></>}
            </button>
            <button className="ch-close" onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
        </div>

        <div className="chat-body">
          {messages.length === 1 && mode === 'AI' && (
            <div className="instant-answers-container">
              <div className="instant-header">Câu hỏi thường gặp</div>
              <div className="instant-list">
                {[
                  "Tư vấn chuột gaming 🖱️",
                  "Tư vấn bàn phím ⌨️",
                  "Tư vấn tai nghe 🎧",
                  "Chính sách giao hàng 🚚",
                  "Theo dõi đơn hàng 📦",
                  "Khuyến mãi đang có 🔥"
                ].map((q, idx) => (
                  <button key={idx} className="instant-btn" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(mode === 'AI' ? messages : supportMessages).map((m, i) => (
            <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'bot'}`}>
              <div className="msg-content">{m.content}</div>
              {m.time && <div className="msg-time">{new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>}
            </div>
          ))}
          {isLoading && (
            <div className="chat-msg bot">
              <div className="msg-content loading">
                <span className="typing-dots"><span>●</span><span>●</span><span>●</span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer-card">
          <div className="chat-input-wrapper">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
