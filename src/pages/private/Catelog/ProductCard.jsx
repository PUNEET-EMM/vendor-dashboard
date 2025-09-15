
import {  Eye, Hash, Percent } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product }) => {
    const [showDetails, setShowDetails] = useState(false);
    const variant = product.variants?.[0] || {};

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                        <img
                            src={variant.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'}
                            alt={product.name}
                            className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {product.name}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <span className="font-medium text-green-600">
                                            ₹{variant.mrp}
                                            {variant.sellingPrice && variant.sellingPrice !== variant.mrp && (
                                                <span className="text-gray-500 ml-1">(₹{variant.sellingPrice})</span>
                                            )}
                                        </span>
                                    </div>
                                    <span className="text-gray-500">
                                        Added: {new Date(product.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex-shrink-0 ml-4">
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {showDetails ? 'Hide' : 'View'}
                                </button>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {showDetails && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="space-y-4">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-500">Category:</span>
                                            <p className="text-gray-900">{product.category}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Sub Category:</span>
                                            <p className="text-gray-900">{product.subCategory}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Product ID:</span>
                                            <p className="text-gray-900 font-mono text-xs">{product._id}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Variants:</span>
                                            <p className="text-gray-900">{product.variants?.length || 1}</p>
                                        </div>
                                    </div>

                                    {/* Variant Details */}
                                    {product.variants?.map((variant, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                                Variant {index + 1} Details
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-500 flex items-center">
                                                        MRP:
                                                    </span>
                                                    <p className="text-gray-900 font-semibold">₹{variant.mrp}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-500 flex items-center">
                                                        Selling Price:
                                                    </span>
                                                    <p className="text-gray-900 font-semibold">
                                                        ₹{variant.sellingPrice || variant.mrp}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-500 flex items-center">
                                                        <Percent className="h-3 w-3 mr-1" />
                                                        GST:
                                                    </span>
                                                    <p className="text-gray-900">{variant.gstPercentage}%</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-500 flex items-center">
                                                        <Hash className="h-3 w-3 mr-1" />
                                                        MOQ:
                                                    </span>
                                                    <p className="text-gray-900">{variant.moq}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard