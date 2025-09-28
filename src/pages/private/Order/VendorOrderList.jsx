import React, { useState } from 'react';
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
  CalendarDays,
  FileText,
  Hash,
  Truck
} from 'lucide-react';
import Layout from '../Layout/Layout';
import OrderDetails from './OrderDetails';
import { useVendorOrders } from '../../../hooks/order';

export default function VendorOrderView() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { 
    data: orders = [], 
    isLoading: loading, 
    error, 
    refetch: handleRefresh,
    isRefetching
  } = useVendorOrders();
  
  // Dynamic status options based on order type
  const getStatusOptions = (isServiceOrder) => {
    if (isServiceOrder) {
      return [
        { value: 'all', label: 'All Orders', color: 'bg-gray-100 text-gray-800', icon: Hash },
        { value: 'Accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
        { value: 'Started', label: 'Started', color: 'bg-purple-100 text-purple-800', icon: Play },
        { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      ];
    } else {
      return [
        { value: 'all', label: 'All Orders', color: 'bg-gray-100 text-gray-800', icon: Hash },
        { value: 'Accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
        { value: 'Started', label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: Truck },
        { value: 'Completed', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      ];
    }
  };

  const getStatusConfig = (status, isServiceOrder) => {
    const statusOptions = getStatusOptions(isServiceOrder);
    return statusOptions.find(option => option.value === status) || statusOptions[1];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  const handleOrderUpdate = (updatedOrder) => {
    // With TanStack Query, we can use the mutation to update the order status
    // and the cache will be automatically invalidated
    setSelectedOrder(updatedOrder);
  };

  const handleRefreshClick = () => {
    handleRefresh();
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Error state (only for real errors)
  if (error && error.message !== 'No orders found') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error.message}
            </div>
            <button 
              onClick={handleRefreshClick} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isRefetching}
            >
              {isRefetching ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetails 
        order={selectedOrder} 
        onBack={handleBackToList}
        onOrderUpdate={handleOrderUpdate}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-gray-600 mt-1">View and manage your orders</p>
              </div>
              <button
                onClick={handleRefreshClick}
                disabled={loading || isRefetching}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${(loading || isRefetching) ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => {
              const isServiceOrder = order.orderType === 'service';
              const statusConfig = getStatusConfig(order.status, isServiceOrder);
              const StatusIcon = statusConfig.icon;
              const totalItems = order.items?.length || 0;
              const totalServices = order.services?.length || 0;
              const firstItem = order.items?.[0];
              const firstService = order.services?.[0];

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
                          {statusConfig.label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isServiceOrder ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isServiceOrder ? (
                            <>
                              <Wrench className="h-3 w-3 mr-1" />
                              Service Order
                            </>
                          ) : (
                            <>
                              <Package className="h-3 w-3 mr-1" />
                              Product Order
                            </>
                          )}
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
                          <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                          Order: {order.orderId?.slice(-6) || 'N/A'}
                        </div>
                        {isServiceOrder ? (
                          <div className="flex items-center text-gray-600">
                            <Wrench className="h-4 w-4 mr-2 flex-shrink-0" />
                            {totalServices} Service{totalServices !== 1 ? 's' : ''}
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-600">
                            <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                            {totalItems} Item{totalItems !== 1 ? 's' : ''}
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>

                      {/* Service Preview */}
                      {isServiceOrder && firstService && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 flex items-center">
                                <Wrench className="h-4 w-4 mr-2" />
                                {firstService.name}
                              </p>
                              <div className="text-sm text-gray-600 mt-1 space-y-1">
                                <p className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {firstService.date} at {firstService.time}
                                </p>
                                {firstService.isHourlyBased && (
                                  <p className="flex items-center">
                                    <Timer className="h-3 w-3 mr-1" />
                                    Hourly Service ({firstService.userInput} hour{firstService.userInput > 1 ? 's' : ''})
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          {totalServices > 1 && (
                            <p className="text-xs text-gray-500 mt-2">
                              +{totalServices - 1} more service{totalServices > 2 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Item Preview */}
                      {!isServiceOrder && firstItem && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{firstItem.name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {firstItem.quantity}
                              </p>
                            </div>
                          </div>
                          {totalItems > 1 && (
                            <p className="text-xs text-gray-500 mt-2">
                              +{totalItems - 1} more item{totalItems > 2 ? 's' : ''}
                            </p>
                          )}
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

            {/* No data found state */}
            {orders.length === 0 && !loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500 mb-4">
                  There are currently no orders available. New orders will appear here when they are received.
                </p>
                <button
                  onClick={handleRefreshClick}
                  disabled={isRefetching}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                  {isRefetching ? 'Checking...' : 'Check for New Orders'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}