import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{
            backgroundColor: '#FF6B35',
            color: 'white',
            padding: window.innerWidth <= 768 ? '12px 24px' : '12px 24px',
            boxShadow: '0 2px 8px rgba(255,107,53,0.3)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
            }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <img
                        src="/logo.png"
                        alt="Eat Better Logo"
                        style={{
                            height: window.innerWidth <= 768 ? '90px' : '90px',
                            width: 'auto'
                        }}
                    />
                </Link>

                <nav style={{
                    display: 'flex',
                    gap: '30px',
                    alignItems: 'center',
                    marginLeft: 'auto'
                }}>
                    <Link to="/" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1.1em',
                        fontWeight: '900',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        transition: 'opacity 0.3s',
                        letterSpacing: '0.5px',
                        marginLeft: '30px'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                        首页
                    </Link>
                    <Link to="/cart" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1.1em',
                        fontWeight: '900',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        transition: 'opacity 0.3s',
                        letterSpacing: '0.5px'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                        购物车
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
