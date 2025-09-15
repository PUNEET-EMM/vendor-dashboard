import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock, 
  User, 
  IndianRupee,
  Building2,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import Layout from '../Layout/Layout';
import OrderDetails from './OrderDetails';
import axiosInstance from '../../../services/axiosInstance';

export default function VendorOrderView() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    accepted: orders.filter(o => o.status === 'Accepted').length,
    rejected: orders.filter(o => o.status === 'Rejected').length
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/vendor/orders');
      
      if (response.data.success) {
        setOrders(response.data.vendorOrders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    // Removed - this is order history, no status changes allowed
  };

  const handleRejectOrder = async (orderId, reason) => {
    // Removed - this is order history, no status changes allowed
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    setSelectedOrder(updatedOrder);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading vendor orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <OrderDetails 
          order={selectedOrder} 
          onBack={handleBackToList}
          onOrderUpdate={handleOrderUpdate}
        />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800"> Orders History</h1>
              </div>
              {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                  <div className="text-sm text-gray-600">Accepted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Filters */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId || order._id}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                          {order.items?.length || 0} items
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          Main Order: {order.mainOrderId}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="text-sm text-gray-600">
                        <strong>Items: </strong>
                        {order.items?.slice(0, 2).map((item, index) => (
                          <span key={item._id || index}>
                            {item.name} (Qty: {item.quantity})
                            {index < Math.min(1, order.items.length - 1) ? ', ' : ''}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span> and {order.items.length - 2} more...</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center justify-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      
                      {/* {order.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptOrder(order._id)}
                            className="flex items-center justify-center px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectOrder(order._id, 'Unable to fulfill at this time')}
                            className="flex items-center justify-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </>
                      )} */}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters to see more orders.'
                    : 'No orders available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}