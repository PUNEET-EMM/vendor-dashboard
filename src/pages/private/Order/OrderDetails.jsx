import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  User,
  RefreshCw,
  FileText,
  ArrowLeft,
  Package,
  Calendar,
  Play,
  AlertCircle,
  Wrench,
  Timer,
  Truck,
  Loader2,
} from 'lucide-react';
import Layout from '../Layout/Layout';
import { useUpdateOrderProgress } from '../../../hooks/order';

export default function OrderDetails({ order, onBack, onOrderUpdate }) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpModalType, setOtpModalType] = useState(''); // 'start' or 'complete'

  const updateProgressMutation = useUpdateOrderProgress();

  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  console.log(order.services.id);

  const isServiceOrder = currentOrder.orderType === 'service';

  // Dynamic status options based on order type
  const getStatusOptions = () => {
    if (isServiceOrder) {
      return [
        { value: 'Accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
        { value: 'Started', label: 'Started', color: 'bg-purple-100 text-purple-800', icon: Play },
        { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      ];
    } else {
      return [
        { value: 'Accepted', label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
        { value: 'Started', label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: Truck },
        { value: 'Completed', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      ];
    }
  };

  const statusOptions = getStatusOptions();

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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Pending': 'Accepted',
      'Accepted': 'Started',
      'Started': 'Completed'
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return null;
    
    const statusConfig = getStatusConfig(nextStatus);
    return statusConfig.label;
  };

  const canProgressStatus = (currentStatus) => {
    return currentStatus === 'Pending' || currentStatus === 'Accepted' || currentStatus === 'Started';
  };

  // Check if the service is hourly-based
  const isHourlyBasedService = () => {
    return currentOrder?.services?.[0]?.isHourlyBased === true;
  };

  const handleStatusProgress = async (targetStatus) => {
    // Show OTP modal for completing any order
    if (targetStatus === 'Completed') {
      setOtpModalType('complete');
      setShowOtpModal(true);
      return;
    }

    // Show OTP modal for starting hourly-based services only
    if (targetStatus === 'Started' && isServiceOrder && isHourlyBasedService()) {
      setOtpModalType('start');
      setShowOtpModal(true);
      return;
    }

    // For other status changes, proceed without OTP
    await updateOrderStatus(targetStatus, '');
  };

  const updateOrderStatus = async (newStatus, otpValue = '') => {
    setOtpError('');

    try {
      // Build base payload
      const payload = {
        orderId: currentOrder._id,
        status: newStatus,
        otp: otpValue,
      };

      // If it's a service order, add serviceId
      if (order?.orderType?.includes("service") && order?.services?.length > 0) {
        payload.serviceId = order.services[0]._id;
      }

      // Call mutation with payload
      await updateProgressMutation.mutateAsync(payload);

      // Update local state
      const updatedOrder = {
        ...currentOrder,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      setCurrentOrder(updatedOrder);

      if (onOrderUpdate) {
        onOrderUpdate(updatedOrder);
      }

      if (showOtpModal) {
        setShowOtpModal(false);
        setOtp('');
        setOtpError('');
        setOtpModalType('');
      }

      console.log(`Order status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating order status:', error);

      if (error.message) {
        setOtpError(error.message);
      } else {
        const errorMessage = `Failed to update order status to ${newStatus}. Please try again.`;
        setOtpError(errorMessage);
        if (!showOtpModal) {
          alert(errorMessage);
        }
      }
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

    const targetStatus = otpModalType === 'start' ? 'Started' : 'Completed';
    await updateOrderStatus(targetStatus, otp);
  };

  const handleOtpModalClose = () => {
    if (!updateProgressMutation.isLoading) {
      setShowOtpModal(false);
      setOtp('');
      setOtpError('');
      setOtpModalType('');
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showOtpModal && !updateProgressMutation.isLoading) {
        handleOtpModalClose();
      }
    };

    if (showOtpModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showOtpModal, updateProgressMutation.isLoading]);

  if (!currentOrder) return null;

  const statusConfig = getStatusConfig(currentOrder.status);
  const StatusIcon = statusConfig.icon;
  const nextStatus = getNextStatus(currentOrder.status);
  const nextStatusLabel = getNextStatusLabel(currentOrder.status);
  const showProgressButton = canProgressStatus(currentOrder.status);
  const isUpdatingStatus = updateProgressMutation.isLoading;

  // Get modal content based on type
  const getOtpModalContent = () => {
    if (otpModalType === 'start') {
      return {
        icon: <Play className="h-6 w-6 text-purple-600" />,
        title: 'Start Service',
        description: 'Please enter the 5-digit OTP to start this hourly-based service.',
        buttonColor: 'bg-purple-600 hover:bg-purple-700',
        buttonText: 'Start Service'
      };
    } else {
      return {
        icon: <CheckCircle className="h-6 w-6 text-green-600" />,
        title: isServiceOrder ? 'Complete Service' : 'Confirm Delivery',
        description: isServiceOrder 
          ? 'Please enter the 5-digit OTP to mark this service as completed.'
          : 'Please enter the 5-digit OTP to confirm delivery of this order.',
        buttonColor: 'bg-green-600 hover:bg-green-700',
        buttonText: isServiceOrder ? 'Complete Service' : 'Confirm Delivery'
      };
    }
  };

  const modalContent = getOtpModalContent();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Full-screen loading overlay when updating status */}
        {isUpdatingStatus && !showOtpModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium text-gray-800">
                Updating order status...
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  disabled={isUpdatingStatus}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {isServiceOrder ? 'Service' : 'Product'} Order Details
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} ${isUpdatingStatus ? 'animate-pulse' : ''}`}>
                      {isUpdatingStatus ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <StatusIcon className="h-3 w-3 mr-1" />
                      )}
                      {isUpdatingStatus ? 'Updating...' : statusConfig.label}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {isServiceOrder ? 'Service Order' : 'Product Order'}
                    </span>
                    {/* Show hourly-based indicator */}
                    {isServiceOrder && isHourlyBasedService() && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Timer className="h-3 w-3 mr-1" />
                        Hourly-Based
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      Updated: {formatDate(currentOrder.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Button */}
              {showProgressButton && nextStatusLabel && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusProgress(nextStatus)}
                    disabled={isUpdatingStatus}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${nextStatus === 'Accepted'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : nextStatus === 'Started'
                          ? isServiceOrder 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : nextStatus === 'Accepted' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : nextStatus === 'Started' ? (
                      isServiceOrder ? <Play className="h-4 w-4" /> : <Truck className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>
                      {isUpdatingStatus
                        ? 'Updating...'
                        : `Mark as ${nextStatusLabel}${nextStatus === 'Started' && isServiceOrder && isHourlyBasedService() ? ' (OTP Required)' : nextStatus === 'Completed' ? ' (OTP Required)' : ''}`
                      }
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Show mutation error if any */}
            {updateProgressMutation.isError && !showOtpModal && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{updateProgressMutation.error.message}</span>
                </div>
              </div>
            )}

            {/* Show success message when update is complete */}
            {updateProgressMutation.isSuccess && !isUpdatingStatus && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Order status updated successfully!</span>
                </div>
              </div>
            )}
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
                  <p className="text-gray-900 font-medium">{currentOrder._id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Main Order ID</label>
                  <p className="text-gray-900">{currentOrder.mainOrderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Order ID</label>
                  <p className="text-gray-900">{currentOrder.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor ID</label>
                  <p className="text-gray-900">{currentOrder.vendorId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Type</label>
                  <p className="text-gray-900 capitalize">{currentOrder.orderType || 'N/A'}</p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Created:</strong> {formatDate(currentOrder.createdAt)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(currentOrder.updatedAt)}</p>
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
                  <p className="text-gray-900">{currentOrder.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Person</label>
                  <p className="text-gray-900">{currentOrder.contactPerson}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">{isServiceOrder ? 'Service Address' : 'Delivery Address'}</label>
                  <p className="text-gray-900">{currentOrder.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section - Only show for service orders */}
          {isServiceOrder && currentOrder.services && currentOrder.services.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Requested Services ({currentOrder.services.length})
              </h2>
              <div className="space-y-4">
                {currentOrder.services.map((service, index) => (
                  <div key={service._id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Date: {service.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Time: {service.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <label className="font-medium text-gray-600">Service Details:</label>
                          {service.isHourlyBased && (
                            <div className="flex items-center text-green-600 mt-1">
                              <Timer className="h-4 w-4 mr-1" />
                              <span>Hourly Based Service (OTP Required to Start)</span>
                            </div>
                          )}
                          {service.userInput && (
                            <div className="mt-2">
                              <span className="text-gray-600">Duration/Quantity: </span>
                              <span className="font-medium text-gray-900">{service.userInput}</span>
                              {service.isHourlyBased && <span className="text-gray-600"> hour(s)</span>}
                            </div>
                          )}
                        </div>
                        {service._id && (
                          <div className="text-xs text-gray-500">
                            Service ID: {service._id}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Section - Show for product orders or if items exist */}
          {(!isServiceOrder || (currentOrder.items && currentOrder.items.length > 0)) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Requested Items ({currentOrder.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {currentOrder.items && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((item, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>{isServiceOrder ? 'No additional items requested' : 'No items in this request'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OTP Modal */}
          {showOtpModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                {/* Loading overlay for OTP modal */}
                {isUpdatingStatus && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-gray-700 font-medium">Processing...</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  {modalContent.icon}
                  <h3 className="text-lg font-semibold text-gray-900">{modalContent.title}</h3>
                </div>

                <p className="text-gray-600 mb-4">
                  {modalContent.description}
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
                    disabled={isUpdatingStatus}
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
                    disabled={isUpdatingStatus}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOtpSubmit}
                    disabled={isUpdatingStatus || otp.length !== 5}
                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${modalContent.buttonColor}`}
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{modalContent.buttonText}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}