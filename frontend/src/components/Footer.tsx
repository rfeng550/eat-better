const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: '#34495e',
            color: 'white',
            padding: '30px 40px',
            marginTop: 'auto',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '30px'
            }}>
                <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                        height: '80px',
                        width: 'auto'
                    }}
                />
                <div style={{ flex: 1 }}>
                    <p style={{
                        margin: '10px 0',
                        fontSize: '0.95em',
                        color: '#bdc3c7'
                    }}>
                        Your journey to healthier eating starts here
                    </p>
                    <div style={{
                        marginTop: '10px',
                        fontSize: '0.9em',
                        color: '#95a5a6'
                    }}>
                        © {currentYear} Eat Better! All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
