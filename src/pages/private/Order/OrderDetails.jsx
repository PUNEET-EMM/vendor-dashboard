import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle,
  Clock, 
  User, 
  MapPin,
  RefreshCw,
  Phone,
  Mail,
  FileText,
  ShoppingBag,
  ArrowLeft,
  Package,
  Building2,
  Calendar,
  Eye,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';
import Layout from '../Layout/Layout';
import axiosInstance from '../../../services/axiosInstance';

export default function OrderDetails({ order, onBack, onOrderUpdate }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const statusOptions = [
    { value: 'Accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    { value: 'Started', label: 'Started', color: 'bg-purple-100 text-purple-800', icon: Play },
    { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Accepted': 'Started',
      'Started': 'Completed'
    };
    return statusFlow[currentStatus];
  };

  const canProgressStatus = (currentStatus) => {
    return currentStatus === 'Accepted' || currentStatus === 'Started';
  };

  const handleStatusProgress = async (targetStatus) => {
    if (targetStatus === 'Completed') {
      setShowOtpModal(true);
      return;
    }

    // For Started status, proceed directly
    await updateOrderStatus(targetStatus, '');
  };

  const updateOrderStatus = async (newStatus, otpValue = '') => {
    setIsUpdatingStatus(true);
    try {
      const payload = {
        status: newStatus
      };

      // Always include OTP in payload
      if (newStatus === 'Completed') {
        payload.otp = otpValue;
      } else {
        payload.otp = ''; // Empty OTP for Started status
      }

      const response = await axiosInstance.patch(
        `/vendor/orders/${currentOrder._id}/progress`,
        payload
      );

      if (response.data.success) {
        const updatedOrder = { ...currentOrder, status: newStatus, updatedAt: new Date().toISOString() };
        setCurrentOrder(updatedOrder);
        
        // Call the parent callback if provided
        if (onOrderUpdate) {
          onOrderUpdate(updatedOrder);
        }

        // Close OTP modal if it was open
        setShowOtpModal(false);
        setOtp('');
        setOtpError('');

        // Show success message (you can replace this with your toast/notification system)
        alert(`Order status updated to ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      
      if (error.response?.data?.message) {
        setOtpError(error.response.data.message);
      } else {
        const errorMessage = `Failed to update order status to ${newStatus}. Please try again.`;
        setOtpError(errorMessage);
        alert(errorMessage);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }

    if (otp.length !== 5) {
      setOtpError('OTP must be 5 digits');
      return;
    }

    await updateOrderStatus('Completed', otp);
  };

  const handleOtpModalClose = () => {
    setShowOtpModal(false);
    setOtp('');
    setOtpError('');
  };

  if (!currentOrder) return null;

  const statusConfig = getStatusConfig(currentOrder.status);
  const StatusIcon = statusConfig.icon;
  const nextStatus = getNextStatus(currentOrder.status);
  const showProgressButton = canProgressStatus(currentOrder.status);

  return (
    <Layout>
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
                  Order #{currentOrder.orderId || currentOrder._id.slice(-6)}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {currentOrder.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Updated: {formatDate(currentOrder.updatedAt)}
                  </span>
                  {currentOrder.hidden && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress Button */}
            {showProgressButton && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusProgress(nextStatus)}
                  disabled={isUpdatingStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    nextStatus === 'Started' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdatingStatus ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : nextStatus === 'Started' ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>
                    {isUpdatingStatus 
                      ? 'Updating...' 
                      : `Mark as ${nextStatus}`
                    }
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Order Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Order ID</label>
                <p className="text-gray-900 font-medium">{currentOrder.orderId || currentOrder._id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Main Order ID</label>
                <p className="text-gray-900">{currentOrder.mainOrderId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Vendor ID</label>
                <p className="text-gray-900">{currentOrder.vendorId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {currentOrder.status}
                </span>
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
                <div className="flex items-center text-gray-900 mt-1">
                  <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  {currentOrder.companyName || 'N/A'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Person</label>
                <div className="flex items-center text-gray-900 mt-1">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  {currentOrder.contactPerson || 'N/A'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Delivery Address</label>
                <div className="flex items-start text-gray-900 mt-1">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  {currentOrder.deliveryAddress || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Order Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Created</span>
                </div>
                <p className="text-gray-900">{formatDate(currentOrder.createdAt)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                </div>
                <p className="text-gray-900">{formatDate(currentOrder.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Order Items ({currentOrder.items?.length || 0})
          </h2>
          <div className="space-y-4">
            {currentOrder.items?.length > 0 ? (
              currentOrder.items.map((item, index) => (
                <div key={item._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>Item ID: {item._id}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No items found in this order</p>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        {/* {currentOrder.services && currentOrder.services.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Services ({currentOrder.services.length})
            </h2>
            <div className="space-y-4">
              {currentOrder.services.map((service, index) => (
                <div key={service._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{service.name || `Service ${index + 1}`}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {service.description && <span>{service.description}</span>}
                      {service._id && <div className="text-xs text-gray-500 mt-1">ID: {service._id}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Complete Order</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Please enter the 5-digit OTP to mark this order as completed.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setOtp(value);
                    if (otpError) setOtpError('');
                  }}
                  placeholder="12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg tracking-widest"
                  maxLength={5}
                />
                {otpError && (
                  <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleOtpModalClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtpSubmit}
                  disabled={isUpdatingStatus || otp.length !== 5}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Complete Order</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}