import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    salePrice: string;
    unit?: string;
    pictures: {
        url: string;
    } | null;
    __record_id: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleBuy = () => {
        if (!product) return;

        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.salePrice,
            quantity: quantity,
            totalPrice: (parseFloat(product.salePrice) * quantity).toFixed(2)
        };

        const existingCartJson = localStorage.getItem('shopping_cart');
        let cart = existingCartJson ? JSON.parse(existingCartJson) : [];

        const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
            cart[existingItemIndex].totalPrice = (parseFloat(product.salePrice) * cart[existingItemIndex].quantity).toFixed(2);
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('shopping_cart', JSON.stringify(cart));
        alert('已添加到购物车！');
        navigate('/cart');
    };

    useEffect(() => {
        fetch('/api/queries/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data: Product[]) => {
                const found = data.find(p => p.id == Number(id));
                if (found) {
                    setProduct(found);
                } else {
                    setError('Product not found in the list');
                }
                setLoading(false);
            })
            .catch(err => {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                fontSize: '1.5em',
                color: '#666'
            }}>
                加载中...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                fontSize: '1.2em',
                color: '#dc3545'
            }}>
                错误: {error}
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                fontSize: '1.2em',
                color: '#666'
            }}>
                未找到该产品
            </div>
        );
    }

    return (
        <div style={{
            padding: isMobile ? '15px' : '30px',
            backgroundColor: '#FFF5E6',
            minHeight: '100vh'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Back Link */}
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: '#FF6B35',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                }}>
                    ← 返回商品列表
                </Link>

                {/* Product Detail Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: isMobile ? '20px' : '40px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginTop: '20px'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '2fr 3fr',
                        gap: isMobile ? '30px' : '40px',
                        alignItems: 'start'
                    }}>
                        {/* Product Image */}
                        <div style={{
                            width: '100%',
                            maxHeight: isMobile ? '200px' : '400px',
                            aspectRatio: '1',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {product.pictures ? (
                                <img
                                    src={product.pictures.url}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    fontSize: '80px',
                                    color: '#ddd'
                                }}>
                                    🍽️
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 style={{
                                margin: '0 0 20px 0',
                                fontSize: isMobile ? '2em' : '2.5em',
                                color: '#333',
                                fontWeight: 'bold',
                                lineHeight: '1.2'
                            }}>
                                {product.name}
                            </h1>

                            <div style={{
                                fontSize: isMobile ? '2em' : '2.5em',
                                color: '#FF6B35',
                                fontWeight: 'bold',
                                marginBottom: '30px'
                            }}>
                                ${product.salePrice}
                                {product.unit && (
                                    <span style={{
                                        fontSize: '0.5em',
                                        color: '#999',
                                        fontWeight: 'normal',
                                        marginLeft: '10px'
                                    }}>
                                        / {product.unit}
                                    </span>
                                )}
                            </div>

                            <div style={{
                                borderTop: '2px solid #FFE0B2',
                                paddingTop: '30px',
                                marginTop: '30px'
                            }}>
                                {/* Quantity Selector */}
                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '15px',
                                        fontSize: '1.2em',
                                        fontWeight: 'bold',
                                        color: '#666'
                                    }}>
                                        数量
                                    </label>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        backgroundColor: '#FFF5E6',
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        width: 'fit-content'
                                    }}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '50%',
                                                border: '2px solid #FF6B35',
                                                backgroundColor: 'white',
                                                color: '#FF6B35',
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FF6B35';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.color = '#FF6B35';
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{
                                            fontSize: '1.8em',
                                            fontWeight: 'bold',
                                            minWidth: '50px',
                                            textAlign: 'center',
                                            color: '#333'
                                        }}>
                                            <input
                                                type="number"
                                                min="1"
                                                max="20"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value) || 1;
                                                    setQuantity(Math.min(Math.max(value, 1), 20));
                                                }}
                                                style={{
                                                    fontSize: '1.8em',
                                                    fontWeight: 'bold',
                                                    width: '70px',
                                                    textAlign: 'center',
                                                    color: '#333',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    outline: 'none'
                                                }}
                                            />
                                        </span>
                                        <button
                                            onClick={() => setQuantity(Math.min(20, quantity + 1))}
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '50%',
                                                border: '2px solid #FF6B35',
                                                backgroundColor: '#FF6B35',
                                                color: 'white',
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FF8C42';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FF6B35';
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleBuy}
                                    style={{
                                        width: '100%',
                                        padding: '18px',
                                        backgroundColor: '#FF6B35',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '1.3em',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 12px rgba(255,107,53,0.4)',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF8C42';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,107,53,0.5)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#FF6B35';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,53,0.4)';
                                    }}
                                >
                                    🛒 加入购物车
                                </button>

                                {/* Total Price */}
                                <div style={{
                                    marginTop: '20px',
                                    padding: '15px',
                                    backgroundColor: '#FFF5E6',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        fontSize: '1.1em',
                                        color: '#666'
                                    }}>
                                        小计
                                    </span>
                                    <span style={{
                                        fontSize: '1.5em',
                                        fontWeight: 'bold',
                                        color: '#FF6B35'
                                    }}>
                                        ${(parseFloat(product.salePrice) * quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
