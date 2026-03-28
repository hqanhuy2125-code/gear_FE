import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import api from '../api';
import '../styles/Wishlist.css';

const Wishlist = () => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const { data } = await api.get(`/api/wishlist/${user.id}`);
            setWishlist(data);
        } catch (err) {
            console.error('Wishlist fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="wishlist-empty">
                        <h2>Vui lòng đăng nhập</h2>
                        <p>Bạn cần đăng nhập để xem danh sách yêu thích của mình.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <h1 className="wishlist-title">Danh sách yêu thích của bạn</h1>
                
                {loading ? (
                    <div className="loading">Đang tải...</div>
                ) : wishlist.length === 0 ? (
                    <div className="wishlist-empty">
                        <div className="empty-icon">❤️</div>
                        <h2>Danh sách trống</h2>
                        <p>Bạn chưa thêm sản phẩm nào vào mục yêu thích.</p>
                        <a href="/" className="btn-browse">Tiếp tục mua sắm</a>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map(product => (
                            <ProductCard 
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image={product.imageUrl}
                                sale={product.salePrice > 0 && product.salePrice < product.price}
                                discount={product.salePrice > 0 ? Math.round((1 - product.salePrice / product.price) * 100) : 0}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
