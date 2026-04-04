import React, { createContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Toast.css';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [activeToast, setActiveToast] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // 1. Made to Order Alert (keeping existing logic)
    if (product.isOrderOnly) {
      alert("Sản phẩm này cần từ 3-7 ngày để chuẩn bị.");
    }

    // 2. Stock Check
    if (product.stock <= 0 && !product.isPreOrder && !product.isOrderOnly) {
      alert("Sản phẩm này hiện đang hết hàng.");
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    
    if (!product.isPreOrder && !product.isOrderOnly && currentQty >= product.stock) {
      alert(`Không thể thêm vào giỏ. Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }

    // Show detailed modal
    setActiveToast(product);
    setIsClosing(false);

    // Auto-close after 5s
    setTimeout(() => {
      closeToast();
    }, 5000);

    setCartItems(prevItems => {
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const closeToast = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActiveToast(null);
      setIsClosing(false);
    }, 400); // match animation
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === productId) {
          if (!item.isPreOrder && !item.isOrderOnly && item.quantity >= item.stock) {
            alert(`Chỉ còn ${item.stock} sản phẩm trong kho!`);
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      cartCount,
      cartTotal,
      activeToast,
      closeToast
    }}>
      {children}
      
      {activeToast && (
        <div className={`cart-modal-overlay ${isClosing ? 'hiding' : ''}`} onClick={closeToast}>
          <div className={`cart-modal-content ${isClosing ? 'hiding' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h3>✅ Đã thêm vào giỏ hàng</h3>
              <button className="close-modal-btn" onClick={closeToast}>&times;</button>
            </div>
            
            <div className="cart-modal-body">
              <img src={activeToast.image} alt={activeToast.name} className="cm-img" />
              <div className="cm-info">
                <h4>{activeToast.name}</h4>
                <p className="cm-price">{activeToast.price.toLocaleString('vi-VN')} ₫</p>
                {(!activeToast.isPreOrder && !activeToast.isOrderOnly) ? (
                   <p className="cm-stock">📦 Kho: Còn <strong>{activeToast.stock}</strong> sản phẩm</p>
                ) : (
                   <p className="cm-stock">📦 Hàng đặt trước</p>
                )}
              </div>
            </div>

            <div className="cart-modal-footer">
              <button className="btn-continue" onClick={closeToast}>Tiếp tục mua sắm</button>
              <Link to="/cart" className="btn-view-cart" onClick={closeToast}>Xem giỏ hàng →</Link>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};
