import React, { useState, useEffect, useCallback } from 'react';
import { Package, AlertCircle, Eye, Filter, DollarSign, Hash, Percent } from 'lucide-react';
import Layout from '../Layout/Layout';
import Pagination from '../../../components/Pagination';
import ProductCard from './ProductCard';

// Mock vendor data - vendor can have multiple categories
const MOCK_VENDOR = {
    id: 'vendor_123',
    name: 'Multi Category Vendor',
    categories: [
        {
            id: '1',
            name: 'Electronics',
            subcategories: [
                { id: '1-1', name: 'Mobile Phones' },
                { id: '1-2', name: 'Laptops' },
                { id: '1-3', name: 'Audio Devices' },
                { id: '1-4', name: 'Gaming' }
            ]
        },
        {
            id: '2',
            name: 'Home & Garden',
            subcategories: [
                { id: '2-1', name: 'Furniture' },
                { id: '2-2', name: 'Kitchen Appliances' },
                { id: '2-3', name: 'Garden Tools' }
            ]
        },
        {
            id: '3',
            name: 'Fashion',
            subcategories: [
                { id: '3-1', name: 'Men\'s Clothing' },
                { id: '3-2', name: 'Women\'s Clothing' },
                { id: '3-3', name: 'Shoes' }
            ]
        }
    ]
};

// Mock products data with multiple categories
const MOCK_PRODUCTS = {
    '1-1': [ // Mobile Phones
        {
            _id: 'prod_001',
            name: 'iPhone 15 Pro',
            description: 'Latest iPhone with titanium design and A17 Pro chip. Features advanced camera system, Action Button, and USB-C connectivity.',
            category: 'Electronics',
            subCategory: 'Mobile Phones',
            createdAt: '2024-01-15',
            vendorId: 'vendor_123',
            variants: [
                {
                    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
                    mrp: 999,
                    sellingPrice: 949,
                    gstPercentage: 18,
                    moq: 1
                }
            ]
        },
        {
            _id: 'prod_002',
            name: 'Samsung Galaxy S24',
            description: 'Premium Android smartphone with AI features, advanced camera capabilities, and long-lasting battery life.',
            category: 'Electronics',
            subCategory: 'Mobile Phones',
            createdAt: '2024-01-20',
            vendorId: 'vendor_123',
            variants: [
                {
                    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
                    mrp: 849,
                    sellingPrice: 799,
                    gstPercentage: 18,
                    moq: 1
                }
            ]
        }
    ],
    '1-2': [ // Laptops
        {
            _id: 'prod_003',
            name: 'MacBook Pro 16"',
            description: 'Professional laptop with M3 chip and Retina display. Perfect for creative professionals and developers.',
            category: 'Electronics',
            subCategory: 'Laptops',
            createdAt: '2024-01-10',
            vendorId: 'vendor_123',
            variants: [
                {
                    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
                    mrp: 2499,
                    sellingPrice: 2399,
                    gstPercentage: 18,
                    moq: 1
                }
            ]
        }
    ],
    '2-1': [ // Furniture
        {
            _id: 'prod_004',
            name: 'Modern Office Chair',
            description: 'Ergonomic office chair with lumbar support and adjustable height. Perfect for long working hours.',
            category: 'Home & Garden',
            subCategory: 'Furniture',
            createdAt: '2024-01-12',
            vendorId: 'vendor_123',
            variants: [
                {
                    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
                    mrp: 299,
                    sellingPrice: 279,
                    gstPercentage: 18,
                    moq: 1
                }
            ]
        }
    ],
    '2-2': [ // Kitchen Appliances
        {
            _id: 'prod_005',
            name: 'Smart Coffee Maker',
            description: 'WiFi-enabled coffee maker with app control and programmable brewing schedules.',
            category: 'Home & Garden',
            subCategory: 'Kitchen Appliances',
            createdAt: '2024-01-18',
            vendorId: 'vendor_123',
            variants: [
                {
                    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
                    mrp: 199,
                    sellingPrice: 179,
                    gstPercentage: 18,
                    moq: 2
                }
            ]
        }
    ],
    '3-1': [ // Men's Clothing
        {
            _id: 'prod_006',
            name: 'Premium Cotton T-Shirt',
            description: 'High-quality cotton t-shirt with comfortable fit and durable construction.',
            category: 'Fashion',
            subCategory: 'Men\'s Clothing',
            createdAt: '2024-01-05',
            vendorId: 'vendor_123',
            variants: [
                {
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
                    mrp: 29,
                    sellingPrice: 24,
                    gstPercentage: 5,
                    moq: 10
                }
            ]
        }
    ]
};

// Loading Spinner Component
const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">{text}</span>
        </div>
    </div>
);

// Empty State Component
const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="text-center py-12">
        <Icon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {action}
    </div>
);


// Main Vendor Catalog Component
const VendorCatalog = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const ITEMS_PER_PAGE = 10;

    // Get subcategories for selected category
    const availableSubcategories = selectedCategory
        ? MOCK_VENDOR.categories.find(cat => cat.id === selectedCategory)?.subcategories || []
        : MOCK_VENDOR.categories.flatMap(cat => cat.subcategories);

    // Simulate API call to fetch products
    const fetchProducts = useCallback(async (categoryId = '', subCategoryId = '', page = 1) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let allProducts = [];

            if (subCategoryId) {
                allProducts = MOCK_PRODUCTS[subCategoryId] || [];
            } else if (categoryId) {
                // Get all products from selected category
                const category = MOCK_VENDOR.categories.find(cat => cat.id === categoryId);
                if (category) {
                    category.subcategories.forEach(subcat => {
                        if (MOCK_PRODUCTS[subcat.id]) {
                            allProducts = allProducts.concat(MOCK_PRODUCTS[subcat.id]);
                        }
                    });
                }
            } else {
                // Get all products from all categories
                allProducts = Object.values(MOCK_PRODUCTS).flat();
            }

            // Pagination
            const startIndex = (page - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedProducts = allProducts.slice(startIndex, endIndex);

            setProducts(paginatedProducts);
            setCurrentPage(page);
            setTotalPages(Math.ceil(allProducts.length / ITEMS_PER_PAGE));
            setTotalProducts(allProducts.length);

        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products. Please try again.');
            setProducts([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(selectedCategory, selectedSubCategory, 1);
    }, [selectedCategory, selectedSubCategory]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSelectedSubCategory(''); // Reset subcategory when category changes
        setCurrentPage(1);
    };

    const handleSubCategoryChange = (e) => {
        const subCategoryId = e.target.value;
        setSelectedSubCategory(subCategoryId);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
        fetchProducts(selectedCategory, selectedSubCategory, newPage);
    };

    const hasProducts = products.length > 0;

    // Get total product count for header
    const allProducts = Object.values(MOCK_PRODUCTS).flat();
    const totalCatalogProducts = allProducts.length;

    return (
        <Layout>

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2"> Catalog</h1>
                        {/* <p className="text-gray-600">
                            View and manage your products across multiple categories
                        </p>
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Package className="h-5 w-5 text-blue-400 mr-2" />
                                    <span className="text-blue-800 font-medium">
                                        {MOCK_VENDOR.name} | {MOCK_VENDOR.categories.length} Categories
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="text-blue-800">📦 {totalCatalogProducts} Total Products</span>
                                    <span className="text-green-800">🏪 {MOCK_VENDOR.categories.length} Categories</span>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Filter className="inline h-4 w-4 mr-1" />
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    {MOCK_VENDOR.categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sub Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sub Category
                                </label>
                                <select
                                    value={selectedSubCategory}
                                    onChange={handleSubCategoryChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={availableSubcategories.length === 0}
                                >
                                    <option value="">All Sub Categories</option>
                                    {availableSubcategories.map((subcat) => (
                                        <option key={subcat.id} value={subcat.id}>
                                            {subcat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                                <span className="text-red-800">{error}</span>
                                <button
                                    onClick={() => fetchProducts(selectedCategory, selectedSubCategory, currentPage)}
                                    className="ml-auto text-red-600 hover:text-red-800 font-medium"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        {loading && <LoadingSpinner text="Loading products..." />}

                        {!loading && !hasProducts && !selectedCategory && !selectedSubCategory && (
                            <EmptyState
                                icon={Package}
                                title="No products in catalog"
                                description="You haven't added any products yet. Start by adding your first product."
                            />
                        )}

                        {!loading && !hasProducts && (selectedCategory || selectedSubCategory) && (
                            <EmptyState
                                icon={Package}
                                title="No products found"
                                description="No products match your current filters. Try adjusting your filter criteria."
                                action={
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('');
                                            setSelectedSubCategory('');
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                }
                            />
                        )}

                        {!loading && hasProducts && (
                            <div className="p-6">
                                {/* Results Summary */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {totalProducts} Product{totalProducts !== 1 ? 's' : ''} Found
                                    </h3>
                                    {(selectedCategory || selectedSubCategory) && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedCategory && `Category: ${MOCK_VENDOR.categories.find(c => c.id === selectedCategory)?.name}`}
                                            {selectedCategory && selectedSubCategory && ' | '}
                                            {selectedSubCategory && `Sub Category: ${availableSubcategories.find(s => s.id === selectedSubCategory)?.name}`}
                                        </p>
                                    )}
                                </div>

                                {/* Products List */}
                                <div className="space-y-4 mb-6">
                                    {products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalProducts={totalProducts}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VendorCatalog;