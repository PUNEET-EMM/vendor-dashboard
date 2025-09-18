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

export default function OrderRequestDetails({ request, onBack, onRequestUpdate ,refetchRequests}) {
  const [currentRequest, setCurrentRequest] = useState(request);

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
    await updateStatusMutation.mutateAsync({
      requestId,
      status: newStatus
    });

    console.log("done")

    const updatedRequest = {
      ...currentRequest,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setCurrentRequest(updatedRequest);

    

    // if (onRequestUpdate) {
    //   onRequestUpdate(updatedRequest);
    // }

    // if (refetchRequests) {
    //   await refetchRequests();
    // }

    toast.success(`Order request status updated to: ${newStatus}`);
  } catch (error) {
    toast.error("Failed to update request status");
  } 
};


  if (!currentRequest) return null;

  const statusConfig = getStatusConfig(currentRequest.status);
  const StatusIcon = statusConfig.icon;
  const isServiceOrder = currentRequest.orderType === 'service';

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
                    {isServiceOrder ? 'Service' : 'Product'} Request Details
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {currentRequest.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {isServiceOrder ? 'Service Order' : 'Product Order'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated: {formatDate(currentRequest.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Dropdown */}

              {currentRequest.status==="Pending" &&
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
                    disabled={updateStatusMutation.isLoading}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 cursor-pointer min-w-[180px]"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {updateStatusMutation.isLoading ? (
                      <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
}
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
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Type</label>
                  <p className="text-gray-900 capitalize">{currentRequest.orderType || 'N/A'}</p>
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
                  <label className="text-sm font-medium text-gray-600">{isServiceOrder ? 'Service Address' : 'Delivery Address'}</label>
                  <p className="text-gray-900">{currentRequest.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section - Only show for service orders */}
          {isServiceOrder && currentRequest.services && currentRequest.services.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2" />
                Requested Services ({currentRequest.services.length})
              </h2>
              <div className="space-y-4">
                {currentRequest.services.map((service, index) => (
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
                              <span>Hourly Based Service</span>
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
          {(!isServiceOrder || (currentRequest.items && currentRequest.items.length > 0)) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Requested Items ({currentRequest.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {currentRequest.items && currentRequest.items.length > 0 ? (
                  currentRequest.items.map((item, index) => (
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
        </div>
      </div>
    </Layout>
  );
}