import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
    productId: number;
    name: string;
    price: string;
    quantity: number;
    totalPrice: string;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = localStorage.getItem('shopping_cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const updateQuantity = (index: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        const updatedCart = [...cartItems];
        updatedCart[index].quantity = newQuantity;
        updatedCart[index].totalPrice = (parseFloat(updatedCart[index].price) * newQuantity).toFixed(2);
        setCartItems(updatedCart);
        localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    };

    const removeItem = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('shopping_cart', JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        localStorage.removeItem('shopping_cart');
        setCartItems([]);
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0).toFixed(2);
    };

    const submitOrder = async () => {
        if (!name || !phone) {
            alert('请输入姓名和手机号码');
            return;
        }

        try {
            const loginRes = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "usernameOrEmail": "__guest_",
                    "password": "guest1!"
                }),
                credentials: 'include'
            });

            const items = cartItems.map(item => ({
                "name": item.productId,
                "count": item.quantity
            }));

            if (!loginRes.ok) throw new Error('Login failed');

            const orderRes: any = await fetch('/api/entities/order/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    items
                }),
                credentials: 'include'
            });

            if (!orderRes.ok) throw new Error('Failed to create order');
            const orderData = await orderRes.json();
            const orderId = orderData.id;

            alert('订单提交成功！');
            clearCart();
            navigate(`/orderConfirm/${orderId}`);

        } catch (error) {
            console.error(error);
            alert('订单提交失败，请重试');
        }
    };

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
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <Link to="/" style={{
                        textDecoration: 'none',
                        color: '#FF6B35',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        ← 继续购物
                    </Link>
                    <h1 style={{
                        margin: 0,
                        fontSize: isMobile ? '1.8em' : '2.5em',
                        color: '#333',
                        fontWeight: 'bold'
                    }}>
                        🛒 购物车
                    </h1>
                    {cartItems.length > 0 && (
                        <button
                            onClick={clearCart}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1em',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                        >
                            清空购物车
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
                        <h2 style={{ color: '#666', marginBottom: '15px' }}>购物车是空的</h2>
                        <p style={{ color: '#999', marginBottom: '30px' }}>快去首页选购商品吧！</p>
                        <Link to="/" style={{
                            display: 'inline-block',
                            padding: '12px 30px',
                            backgroundColor: '#FF6B35',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1.1em',
                            transition: 'all 0.3s ease'
                        }}>
                            开始购物
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                        gap: '30px'
                    }}>
                        {/* Cart Items */}
                        <div>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    marginBottom: '15px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    gap: '20px',
                                    alignItems: 'center',
                                    flexWrap: isMobile ? 'wrap' : 'nowrap'
                                }}>
                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                        <h3 style={{
                                            margin: '0 0 10px 0',
                                            color: '#333',
                                            fontSize: '1.3em'
                                        }}>
                                            {item.name}
                                        </h3>
                                        <p style={{
                                            margin: 0,
                                            color: '#FF6B35',
                                            fontSize: '1.2em',
                                            fontWeight: 'bold'
                                        }}>
                                            ${item.price}
                                        </p>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        backgroundColor: '#FFF5E6',
                                        padding: '8px 12px',
                                        borderRadius: '8px'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity - 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                border: '2px solid #FF6B35',
                                                backgroundColor: 'white',
                                                color: '#FF6B35',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{
                                            fontSize: '1.2em',
                                            fontWeight: 'bold',
                                            minWidth: '30px',
                                            textAlign: 'center'
                                        }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(index, item.quantity + 1)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                border: '2px solid #FF6B35',
                                                backgroundColor: '#FF6B35',
                                                color: 'white',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div style={{
                                        fontSize: '1.4em',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        minWidth: '80px',
                                        textAlign: 'right'
                                    }}>
                                        ${item.totalPrice}
                                    </div>

                                    <button
                                        onClick={() => removeItem(index)}
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            color: '#dc3545',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#dc3545';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                            e.currentTarget.style.color = '#dc3545';
                                        }}
                                    >
                                        删除
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Checkout Section */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            height: 'fit-content',
                            position: isMobile ? 'relative' : 'sticky',
                            top: isMobile ? 'auto' : '20px'
                        }}>
                            <Link
                                to="/"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#FFF5E6',
                                    color: '#FF6B35',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '1em',
                                    marginBottom: '20px',
                                    border: '2px solid #FF6B35',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FF6B35';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FFF5E6';
                                    e.currentTarget.style.color = '#FF6B35';
                                }}
                            >
                                继续购物
                            </Link>

                            <h2 style={{
                                margin: '0 0 20px 0',
                                color: '#333',
                                fontSize: '1.6em'
                            }}>
                                订单信息
                            </h2>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#666',
                                    fontWeight: 'bold'
                                }}>
                                    姓名
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="请输入您的姓名"
                                    style={{
                                        padding: '12px 15px',
                                        width: '100%',
                                        border: '2px solid #FFE0B2',
                                        borderRadius: '8px',
                                        fontSize: '1em',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B35'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#FFE0B2'}
                                />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    color: '#666',
                                    fontWeight: 'bold'
                                }}>
                                    手机号码
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="请输入您的手机号"
                                    style={{
                                        padding: '12px 15px',
                                        width: '100%',
                                        border: '2px solid #FFE0B2',
                                        borderRadius: '8px',
                                        fontSize: '1em',
                                        outline: 'none',
                                        transition: 'border-color 0.3s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B35'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#FFE0B2'}
                                />
                            </div>

                            <div style={{
                                borderTop: '2px solid #FFE0B2',
                                paddingTop: '20px',
                                marginBottom: '20px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    fontSize: '1.1em',
                                    color: '#666'
                                }}>
                                    <span>商品数量</span>
                                    <span style={{ fontWeight: 'bold' }}>{cartItems.length} 件</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '1.3em',
                                    fontWeight: 'bold',
                                    color: '#FF6B35'
                                }}>
                                    <span>总计</span>
                                    <span>${calculateTotal()}</span>
                                </div>
                            </div>

                            <button
                                onClick={submitOrder}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    backgroundColor: '#FF6B35',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '1.2em',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(255,107,53,0.4)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FF8C42';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FF6B35';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                提交订单
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
