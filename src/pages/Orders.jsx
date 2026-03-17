import React, { useEffect, useState } from 'react';
import '../styles/Account.css';

const seedOrders = () => [
  {
    id: '#1023',
    date: '2026-03-10',
    total: 1400000,
    status: 'Delivered',
    items: [
      { name: 'Gaming Keyboard CLX21', quantity: 1, price: 900000 },
      { name: 'Wireless Mouse CLX21', quantity: 1, price: 500000 },
    ],
  },
  {
    id: '#1024',
    date: '2026-03-12',
    total: 800000,
    status: 'Shipping',
    items: [{ name: 'Headset CLX21', quantity: 1, price: 800000 }],
  },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('orders');
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
        return;
      } catch {
        // ignore
      }
    }
    const seeded = seedOrders();
    setOrders(seeded);
    localStorage.setItem('orders', JSON.stringify(seeded));
  }, []);

  const formatCurrency = (value) =>
    `${value.toLocaleString('vi-VN')} ₫`;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container account-page">
      <div className="account-card">
        <h1 className="account-title">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <p className="account-text">
            Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay hôm nay!
          </p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="account-btn tertiary orders-view-btn"
                          onClick={() => toggleExpand(order.id)}
                        >
                          {expandedId === order.id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="order-details-row">
                        <td colSpan="5">
                          <div className="order-details-card">
                            <h4>Order details</h4>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  <span>{item.name}</span>
                                  <span>
                                    x{item.quantity} · {formatCurrency(item.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

