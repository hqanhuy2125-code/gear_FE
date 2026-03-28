import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { Send, User, MessageSquare, Search } from 'lucide-react';
import '../styles/AdminChat.css';

const AdminChat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connection, setConnection] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchUsers();
        
        const conn = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5130/hubs/chat")
            .withAutomaticReconnect()
            .build();
        conn.on("ReceiveMessage", (msg) => {
            // Update users list (unread counts, last message)
            fetchUsers();

            // If the message is from or to the currently selected user
            if (selectedUser && (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id || (msg.isAdminSender && msg.receiverId === selectedUser.id))) {
                setMessages(prev => [...prev, {
                    id: msg.id,
                    senderId: msg.senderId,
                    receiverId: msg.receiverId,
                    message: msg.message,
                    isAdminSender: msg.isAdminSender,
                    createdAt: msg.createdAt
                }]);
            }
        });

        conn.start()
            .then(() => {
                conn.invoke("JoinChat", adminUser.id, true);
                setConnection(conn);
            })
            .catch(err => console.error(err));

        return () => conn.stop();
    }, [selectedUser?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5130/api/chat/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
        try {
            const res = await fetch(`http://localhost:5130/api/chat/history/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                // Mark as read
                await fetch(`http://localhost:5130/api/chat/read/${user.id}`, { method: 'PUT' });
                fetchUsers(); // Update unread counts
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedUser || !connection) return;
        
        await connection.invoke("SendMessageToUser", adminUser.id, selectedUser.id, input.trim());
        setInput('');
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-chat-container">
            <div className="admin-chat-sidebar">
                <div className="sidebar-header">
                    <h2>Hỗ trợ khách hàng</h2>
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm user..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="user-list">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                            <div 
                                key={u.id} 
                                className={`user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                                onClick={() => handleSelectUser(u)}
                            >
                                <div className="user-avatar">
                                    <User size={20} />
                                    {u.unreadCount > 0 && <span className="unread-badge">{u.unreadCount}</span>}
                                </div>
                                <div className="user-info">
                                    <div className="user-name-row">
                                        <span className="user-name">{u.name}</span>
                                        <span className="user-time">{u.lastTime ? new Date(u.lastTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                    </div>
                                    <p className="user-last-msg">{u.lastMessage || 'Chưa có tin nhắn'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">Không tìm thấy user</div>
                    )}
                </div>
            </div>

            <div className="admin-chat-main">
                {selectedUser ? (
                    <>
                        <div className="chat-main-header">
                            <div className="selected-user-info">
                                <span className="selected-name">{selectedUser.name}</span>
                                <span className="selected-email">{selectedUser.email}</span>
                            </div>
                        </div>
                        <div className="chat-messages">
                            {messages.map((m, i) => (
                                <div key={m.id || i} className={`chat-bubble ${m.isAdminSender ? 'admin' : 'user'}`}>
                                    <div className="bubble-content">{m.message}</div>
                                    <div className="bubble-time">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-main-footer">
                            <input 
                                type="text" 
                                placeholder="Nhập tin nhắn..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend} disabled={!input.trim()}>
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-selection">
                        <MessageSquare size={64} />
                        <p>Chọn một người dùng để bắt đầu trả lời hỗ trợ</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
