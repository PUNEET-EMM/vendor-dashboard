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
  Eye
} from 'lucide-react';
import Layout from '../Layout/Layout';

export default function OrderDetails({ order, onBack, onOrderUpdate }) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
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

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Removed - this is order history, no status changes allowed
  };

  if (!currentOrder) return null;

  const statusConfig = getStatusConfig(currentOrder.status);
  const StatusIcon = statusConfig.icon;

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
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Visibility</span>
                </div>
                <p className="text-gray-900">{currentOrder.hidden ? 'Hidden' : 'Visible'}</p>
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
        {currentOrder.services && currentOrder.services.length > 0 && (
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
        )}

        {/* Additional Information */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-600">Order Version</label>
              <p className="text-gray-900">v{currentOrder.__v || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-600">Order Status</label>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {currentOrder.status}
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  );
}