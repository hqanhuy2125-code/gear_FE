import React, { createContext, useState, useEffect } from 'react';
import '../styles/Toast.css';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const toastId = Date.now() + Math.random();
    setToasts(prev => [...prev, { id: toastId, name: product.name, hiding: false }]);

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === toastId ? { ...t, hiding: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 300);
    }, 3000);


    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
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
      cartTotal
    }}>
      {children}
      
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.hiding ? 'hiding' : ''}`}>
              <span className="toast-icon">✅</span>
              <span>Đã thêm <strong>{toast.name}</strong> vào giỏ hàng!</span>
            </div>
          ))}
        </div>
      )}
    </CartContext.Provider>
  );
};
