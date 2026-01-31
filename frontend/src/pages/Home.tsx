import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    salePrice: string;
    unit?: string;
    pictures: {
        url: string;
    } | null;
    category?: Category[];
    __record_id: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const Home = () => {
    // Helper function to get emoji for category
    const getCategoryEmoji = (categoryName: string): string => {
        const emojiMap: { [key: string]: string } = {
            '蔬菜': '🥬',
            '水果': '🍎',
            '肉': '🥩',
            '海鲜': '🦞',
            '面食': '🍜',
            '速食': '🍱'
        };
        return emojiMap[categoryName] || '🍽️';
    };
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');
    const selectedCategory = (categoryParam && categoryParam !== 'all') ? Number(categoryParam) : 'all';
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [displayCount, setDisplayCount] = useState<number>(8);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productRes = await fetch('/api/queries/products');
                if (!productRes.ok) throw new Error('Failed to fetch products');
                const productData = await productRes.json();
                setProducts(productData);

                // Fetch categories
                const categoryRes = await fetch('/api/queries/category');
                if (!categoryRes.ok) throw new Error('Failed to fetch categories');
                const categoryData = await categoryRes.json();
                setCategories(categoryData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter by category
    let filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category?.some(c => c.id === selectedCategory));

    // Filter by search term

    if (searchTerm.trim()) {
        const lowerTerm = searchTerm.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(p => {
            const name = p.name.toLowerCase();

            // 1. Exact match (includes substring)
            if (name.includes(lowerTerm)) return true;

            // 2. Fuzzy match for Chinese: match if any character matches
            // This allows finding "中芹" when searching "芹菜" (common char "芹")
            // Only apply if the search term contains Chinese characters to avoid noise for English
            const hasChinese = /[\u4e00-\u9fa5]/.test(lowerTerm);
            if (hasChinese) {
                const searchChars = lowerTerm.split('').filter(c => c.trim() !== '');
                return searchChars.some(char => name.includes(char));
            }

            return false;
        });
    }

    const displayedProducts = filteredProducts.slice(0, displayCount);
    const hasMore = filteredProducts.length > displayCount;

    // Reset display count and search when category changes
    useEffect(() => {
        setDisplayCount(8);
        setSearchTerm('');
    }, [selectedCategory]);

    if (loading) return <div>加载中...</div>;
    if (error) return <div>错误: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>

            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 搜索产品..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 20px',
                        fontSize: '1em',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                <button
                    onClick={() => setSearchParams({ category: 'all' })}
                    style={{
                        padding: '14px 28px',
                        backgroundColor: selectedCategory === 'all' ? '#FF6B35' : '#FFF5E6',
                        color: selectedCategory === 'all' ? 'white' : '#333',
                        border: selectedCategory === 'all' ? 'none' : '2px solid #FFE0B2',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontSize: '1.1em',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: selectedCategory === 'all' ? '0 4px 12px rgba(255,107,53,0.4)' : '0 2px 6px rgba(255,152,0,0.2)'
                    }}
                >
                    🌟 全部
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSearchParams({ category: category.id.toString() })}
                        style={{
                            padding: '14px 28px',
                            backgroundColor: selectedCategory === category.id ? '#FF6B35' : '#FFF5E6',
                            color: selectedCategory === category.id ? 'white' : '#333',
                            border: selectedCategory === category.id ? 'none' : '2px solid #FFE0B2',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '1.1em',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedCategory === category.id ? '0 4px 12px rgba(255,107,53,0.4)' : '0 2px 6px rgba(255,152,0,0.2)'
                        }}
                    >
                        {getCategoryEmoji(category.name)} {category.name}
                    </button>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: '20px'
            }}>
                {displayedProducts.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {product.pictures && (
                            <img
                                src={`http://localhost:5265${product.pictures.url}`}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                            />
                        )}
                        <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                        <p style={{ margin: '0 0 10px 0', color: '#666' }}>价格: ${product.salePrice}{product.unit ? ` / ${product.unit}` : ''}</p>
                        <Link
                            to={`/${product.id}`}
                            style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            查看详情
                        </Link>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={() => setDisplayCount(prev => prev + 4)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#FF8C42',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1em',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(255,140,66,0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF6B35'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF8C42'}
                    >
                        加载更多
                    </button>
                </div>
            )}

            {/* Scroll to Top Button - Mobile Only */}
            {isMobile && showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#FF6B35',
                        color: 'white',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(255,107,53,0.4)',
                        zIndex: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default Home;
