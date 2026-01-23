import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category?.some(c => c.id === selectedCategory));

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>All Products</h1>

            {/* Category Filter */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                <button
                    onClick={() => setSelectedCategory('all')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: selectedCategory === 'all' ? '#007bff' : '#f0f0f0',
                        color: selectedCategory === 'all' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    All
                </button>
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: selectedCategory === category.id ? '#007bff' : '#f0f0f0',
                            color: selectedCategory === category.id ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {product.pictures && (
                            <img
                                src={`http://localhost:5265${product.pictures.url}`}
                                alt={product.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }}
                            />
                        )}
                        <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                        <p style={{ margin: '0 0 10px 0', color: '#666' }}>Price: ${product.salePrice}{product.unit ? ` / ${product.unit}` : ''}</p>
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
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
