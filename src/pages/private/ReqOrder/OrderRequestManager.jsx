import React, { useState } from 'react';
import { 
  Package, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock, 
  Building2,
  Calendar,
  MapPin,
  Phone,
  FileText,
  RefreshCw,
  Hash,
  Wrench,
  Timer
} from 'lucide-react';
import Layout from '../Layout/Layout';
import OrderRequestDetails from './OrderRequestDetails';
import { useOrderRequests } from '../../../hooks/order';

export default function OrderRequestManager() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { data: requests = [], isLoading: loading, error, refetch } = useOrderRequests();

  const statusOptions = [
    { value: 'all', label: 'All Requests', color: 'bg-gray-100 text-gray-800', icon: Hash },
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[1];
  };

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
    refetch();
  };

  const handleRequestUpdate = (updatedRequest) => {
 
    setSelectedRequest(updatedRequest);
    // refetch(); 
  };

  const handleRefresh = () => {
    refetch();
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

  // Error state (only for real errors, not 404 with no data)
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error.message}
            </div>
            <button 
              onClick={handleRefresh} 
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
        refetchRequests={refetch}
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
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Order Requests List */}
          <div className="space-y-4">
            {requests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const StatusIcon = statusConfig.icon;
              const isServiceOrder = request.orderType === 'service';
              const totalItems = request.items?.length || 0;
              const totalServices = request.services?.length || 0;
              const firstItem = request.items?.[0];
              const firstService = request.services?.[0];

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
                          {formatDate(request.createdAt)}
                        </div>
                      </div>

                      {/* Service Preview */}
                      {isServiceOrder && firstService && (
                        <div className="  p-3">
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

            {/* No data found state */}
            {requests.length === 0 && !loading && !error && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Order Requests Found</h3>
                <p className="text-gray-500 mb-4">
                  There are currently no order requests available. New requests will appear here when they are created.
                </p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Check for New Requests
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}