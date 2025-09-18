import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Eye, 
  CheckCircle, 
  XCircle,
  Building2,
  Calendar,
  RefreshCw,
  MapPin,
  Phone,
  Play,
  Clock,
  Wrench,
  Timer,
  CalendarDays
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
    { value: 'all', label: 'All Orders', color: 'bg-gray-100 text-gray-800', icon: Package },
    { value: 'Started', label: 'Started', color: 'bg-purple-100 text-purple-800', icon: Play },
    { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle }
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    accepted: orders.filter(o => o.status === 'Accepted').length,
    started: orders.filter(o => o.status === 'Started').length,
    completed: orders.filter(o => o.status === 'Completed').length
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
        setOrders(response.data.orderRequest || response.data.vendorOrders || []);
      } else {
        setError('No orders found');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Handle 404 specifically for "No orders found" case
      if (err.response?.status === 404) {
        setError('No orders found');
        setOrders([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[1];
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mainOrderId?.toLowerCase().includes(searchTerm.toLowerCase());
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
                <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-gray-600 mt-1">View and manage your orders</p>
              </div>
              
            </div>
            
          
          </div>

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
                          Order #{order.orderId || order._id.slice(-6)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.orderType === 'service' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.orderType === 'service' ? 'Service Order' : 'Product Order'}
                        </span>
                        {order.hidden && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          {order.companyName || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          {order.deliveryAddress || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          {order.contactPerson || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                          {order.items?.length || 0} items
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Wrench className="h-4 w-4 mr-2 flex-shrink-0" />
                          {order.services?.length || 0} services
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>

                      {/* Services Preview */}
                      {order.services && order.services.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-200">
                          <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-2">
                              <Wrench className="h-4 w-4 text-purple-600" />
                              <strong className="text-gray-700">Services:</strong>
                            </div>
                            {order.services.slice(0, 2).map((service, index) => (
                              <div key={service._id || index} className="mb-2 last:mb-0">
                                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                  <span className="font-medium text-purple-700">{service.name}</span>
                                  {service.date && (
                                    <div className="flex items-center">
                                      <CalendarDays className="h-3 w-3 mr-1 text-purple-600" />
                                      <span>{service.date}</span>
                                    </div>
                                  )}
                                  {service.time && (
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1 text-purple-600" />
                                      <span>{service.time}</span>
                                    </div>
                                  )}
                                  {service.isHourlyBased && service.userInput && (
                                    <div className="flex items-center">
                                      <Timer className="h-3 w-3 mr-1 text-purple-600" />
                                      <span>{service.userInput} hr(s)</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {order.services.length > 2 && (
                              <span className="text-gray-500"> and {order.services.length - 2} more services...</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Items Preview */}
                      {order.items && order.items.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm">
                            <strong className="text-gray-700">Items: </strong>
                            {order.items.slice(0, 2).map((item, index) => (
                              <span key={item._id || index} className="text-gray-600">
                                {item.name} (Qty: {item.quantity})
                                {index < Math.min(1, order.items.length - 1) ? ', ' : ''}
                              </span>
                            ))}
                            {order.items.length > 2 && (
                              <span className="text-gray-500"> and {order.items.length - 2} more...</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center justify-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {error === 'No orders found' ? 'No Orders Available' : 'No Orders Found'}
                </h3>
                <p className="text-gray-500">
                  {error === 'No orders found' 
                    ? 'You have no orders in your history yet. Orders will appear here once you start receiving them.'
                    : searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters to see more orders.'
                    : 'No orders available at the moment.'
                  }
                </p>
                {error === 'No orders found' && (
                  <button
                    onClick={fetchOrders}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2 inline" />
                    Check Again
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error State */}
          {error && error !== 'No orders found' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}