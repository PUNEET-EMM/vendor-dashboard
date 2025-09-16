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
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  RefreshCw,
  ShoppingCart,
  Hash,
  CalendarDays,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance';
import Layout from '../Layout/Layout';

// Order Request Details Component
function OrderRequestDetails({ request, onBack, onRequestUpdate }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(request);

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setIsUpdatingStatus(true);

      const response = await axiosInstance.patch(
        `/vendor/orders/request/${requestId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        const updatedRequest = {
          ...currentRequest,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };

        setCurrentRequest(updatedRequest);

        if (onRequestUpdate) {
          onRequestUpdate(updatedRequest);
        }

        alert(`Order request status updated to: ${newStatus}`);
      }

    } catch (err) {
      console.error('Error updating request status:', err);
      alert('Failed to update request status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!currentRequest) return null;

  const statusConfig = getStatusConfig(currentRequest.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Order Request Details
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {currentRequest.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated: {formatDate(currentRequest.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Update Status:</label>
                <div className="relative">
                  <select
                    value={currentRequest.status}
                    onChange={(e) => {
                      if (e.target.value !== currentRequest.status) {
                        handleStatusUpdate(currentRequest._id, e.target.value);
                      }
                    }}
                    disabled={isUpdatingStatus}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 cursor-pointer min-w-[180px]"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isUpdatingStatus ? (
                      <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Request Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Request ID</label>
                  <p className="text-gray-900 font-medium">{currentRequest._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Main Order ID</label>
                  <p className="text-gray-900">{currentRequest.mainOrderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Order ID</label>
                  <p className="text-gray-900">{currentRequest.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor ID</label>
                  <p className="text-gray-900">{currentRequest.vendorId}</p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Created:</strong> {formatDate(currentRequest.createdAt)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(currentRequest.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <p className="text-gray-900">{currentRequest.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Person</label>
                  <p className="text-gray-900">{currentRequest.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Delivery Address</label>
                  <p className="text-gray-900">{currentRequest.deliveryAddress}</p>
                </div>
                {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Request Status</p>
                    <p className="text-sm text-gray-600">Hidden: {currentRequest.hidden ? 'Yes' : 'No'}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    <StatusIcon className="h-4 w-4 mr-2" />
                    {currentRequest.status}
                  </span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Requested Items ({currentRequest.items?.length || 0})
            </h2>
            <div className="space-y-4">
              {currentRequest.items?.map((item, index) => (
                <div key={item._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>Item ID: {item._id}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-gray-900">Qty: {item.quantity}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No items in this request</p>
                </div>
              )}
            </div>
          </div>

          {/* Services (if any) */}
          {currentRequest.services && currentRequest.services.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Services ({currentRequest.services.length})
              </h2>
              <div className="space-y-4">
                {currentRequest.services.map((service, index) => (
                  <div key={service._id || index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{service.name || 'Service Details'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Main Order Request Manager Component
export default function OrderRequestManager() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Requests', color: 'bg-gray-100 text-gray-800', icon: Hash },
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  useEffect(() => {
    fetchOrderRequests();
  }, []);

  const fetchOrderRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/vendor/orders/request');
      
      if (response.data.success) {
        setRequests(response.data.orderRequest || []);
      } else {
        setError('Failed to fetch order requests');
      }
    } catch (error) {
      console.error('Error fetching order requests:', error);
      setError(error.response?.data?.message || 'Failed to fetch order requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[1];
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch =
      request._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.mainOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  const handleRequestUpdate = (updatedRequest) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request._id === updatedRequest._id ? updatedRequest : request
      )
    );
    setSelectedRequest(updatedRequest);
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

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button 
              onClick={fetchOrderRequests} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (selectedRequest) {
    return (
      <OrderRequestDetails 
        request={selectedRequest} 
        onBack={handleBackToList}
        onRequestUpdate={handleRequestUpdate}
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
                <h1 className="text-2xl font-bold text-gray-800">Order Request Management</h1>
                <p className="text-gray-600 mt-1">Review and manage upcoming order requests</p>
              </div>
              <button
                onClick={fetchOrderRequests}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by Request ID, Order ID, Main Order ID, or Company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div> */}

          {/* Order Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              const totalItems = request.items?.length || 0;
              const firstItem = request.items?.[0];

              return (
                <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Request #{request._id.slice(-6)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {request.status}
                        </span>
                        {request.hidden && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                          {request.companyName || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          {request.deliveryAddress || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          {request.contactPerson || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                          Order: {request.orderId?.slice(-6) || 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Package className="h-4 w-4 mr-2 flex-shrink-0" />
                          {totalItems} Item{totalItems !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          {formatDate(request.createdAt)}
                        </div>
                      </div>

                      {/* Item Preview */}
                      {firstItem && (
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
                        onClick={() => handleViewRequest(request)}
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

            {filteredRequests.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Order Requests Found</h3>
                <p className="text-gray-500">
                  {statusFilter !== 'all' ? `No ${statusFilter.toLowerCase()} requests available.` : 'No order requests available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}