import React, { useState } from 'react';
import {
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  ArrowLeft,
  RefreshCw,
  Wrench,
  Timer
} from 'lucide-react';
import Layout from '../Layout/Layout';
import { useUpdateOrderRequestStatus } from '../../../hooks/order';
import { toast } from 'react-toastify';

export default function OrderRequestDetails({ request, onBack, onRequestUpdate, refetchRequests }) {
  const [currentRequest, setCurrentRequest] = useState(request);
  const [loadingAction, setLoadingAction] = useState(null); // Track which action is loading

  const updateStatusMutation = useUpdateOrderRequestStatus();

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
      setLoadingAction(newStatus);
      
      await updateStatusMutation.mutateAsync({
        requestId,
        status: newStatus
      });

      console.log("Status updated successfully");

      const updatedRequest = {
        ...currentRequest,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      setCurrentRequest(updatedRequest);

      if (onRequestUpdate) {
        onRequestUpdate(updatedRequest);
      }

      toast.success(`Order request ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${newStatus.toLowerCase()} request`);
    } finally {
      setLoadingAction(null);
    }
  };

  if (!currentRequest) return null;

  const statusConfig = getStatusConfig(currentRequest.status);
  const StatusIcon = statusConfig.icon;
  const isServiceOrder = currentRequest.orderType === 'service';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
        <div className="space-y-4 sm:space-y-6">
          {/* Header - Mobile responsive */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <button
                onClick={onBack}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 mt-1 sm:mt-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 break-words">
                  {isServiceOrder ? 'Service' : 'Product'} Request Details
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
                  <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} w-fit`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {currentRequest.status}
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                    {isServiceOrder ? 'Service Order' : 'Product Order'}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Updated: {formatDate(currentRequest.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile responsive */}
            {currentRequest.status === "Pending" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
                <button
                  onClick={() => handleStatusUpdate(currentRequest._id, 'Accepted')}
                  disabled={!!loadingAction}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors min-w-[120px] text-sm sm:text-base"
                >
                  {loadingAction === 'Accepted' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStatusUpdate(currentRequest._id, 'Rejected')}
                  disabled={!!loadingAction}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors min-w-[120px] text-sm sm:text-base"
                >
                  {loadingAction === 'Rejected' ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Request Information - Mobile responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Request Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Request ID</label>
                  <p className="text-sm sm:text-base text-gray-900 font-medium font-mono break-all">{currentRequest._id}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Main Order ID</label>
                  <p className="text-sm sm:text-base text-gray-900 font-mono break-all">{currentRequest.mainOrderId}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Order ID</label>
                  <p className="text-sm sm:text-base text-gray-900 font-mono break-all">{currentRequest.orderId}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Vendor ID</label>
                  <p className="text-sm sm:text-base text-gray-900 font-mono break-all">{currentRequest.vendorId}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Order Type</label>
                  <p className="text-sm sm:text-base text-gray-900 capitalize">{currentRequest.orderType || 'N/A'}</p>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1 pt-2">
                  <p><strong>Created:</strong> <span className="break-words">{formatDate(currentRequest.createdAt)}</span></p>
                  <p><strong>Last Updated:</strong> <span className="break-words">{formatDate(currentRequest.updatedAt)}</span></p>
                </div>
              </div>
            </div>

            {/* Customer Information - Mobile responsive */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Customer Information
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Company Name</label>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{currentRequest.companyName}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">Contact Person</label>
                  <p className="text-sm sm:text-base text-gray-900 break-words">{currentRequest.contactPerson}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-600">{isServiceOrder ? 'Service Address' : 'Delivery Address'}</label>
                  <p className="text-sm sm:text-base text-gray-900 leading-relaxed break-words">{currentRequest.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section - Mobile responsive */}
          {isServiceOrder && currentRequest.services && currentRequest.services.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <Wrench className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Requested Services ({currentRequest.services.length})
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {currentRequest.services.map((service, index) => (
                  <div key={service._id || index} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 sm:gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base break-words">{service.name}</h3>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                            <span className="break-words">Date: {service.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                            <span className="break-words">Time: {service.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm">
                          <label className="font-medium text-gray-600">Service Details:</label>
                          {service.isHourlyBased && (
                            <div className="flex items-center text-green-600 mt-1">
                              <Timer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                              <span>Hourly Based Service</span>
                            </div>
                          )}
                          {service.userInput && (
                            <div className="mt-2">
                              <span className="text-gray-600">Duration/Quantity: </span>
                              <span className="font-medium text-gray-900 break-words">{service.userInput}</span>
                              {service.isHourlyBased && <span className="text-gray-600"> hour(s)</span>}
                            </div>
                          )}
                        </div>
                        {service._id && (
                          <div className="text-xs text-gray-500">
                            <span className="break-words">Service ID: {service._id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Section - Mobile responsive */}
          {(!isServiceOrder || (currentRequest.items && currentRequest.items.length > 0)) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Requested Items ({currentRequest.items?.length || 0})
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {currentRequest.items && currentRequest.items.length > 0 ? (
                  currentRequest.items.map((item, index) => (
                    <div key={item._id || index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base break-words">{item.name}</h3>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">
                          <span className="break-all">Item ID: {item._id}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm sm:text-base">{isServiceOrder ? 'No additional items requested' : 'No items in this request'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}