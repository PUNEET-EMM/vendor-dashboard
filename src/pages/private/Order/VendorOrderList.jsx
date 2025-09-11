
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
  Search,
  RefreshCw,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  ShoppingBag,
  ArrowLeft,
  Filter,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import Layout from '../Layout/Layout';

const dummyOrders = [
  {
    _id: '1',
    orderId: 'ORD-2024-001',
    companyName: 'Tech Solutions Pvt Ltd',
    companyGst: 'GSTIN123456789',
    orderByName: 'Rajesh Kumar',
    orderByEmail: 'rajesh@techsolutions.com',
    orderByContact: '+91 9876543210',
    currentStatus: 'Pending',
    subTotal: 45000,
    gstTotal: 8100,
    totalAmount: 53100,
    billingAddress: '123, MG Road, Sector 29, Gurugram, Haryana - 122001',
    deliveryAddress: '456, Cyber Hub, DLF Phase 2, Gurugram, Haryana - 122002',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    items: [
      {
        _id: 'item1',
        name: 'Dell Laptop - Inspiron 15',
        unitPrice: 45000,
        quantity: 1,
        gstPercentage: 18,
        subTotal: 45000,
        gstTotal: 8100,
        totalPrice: 53100
      }
    ],
    expectedDeliveryDate: '2024-01-20',
    priority: 'High',
    paymentTerms: 'Net 30 days'
  },
  {
    _id: '2',
    orderId: 'ORD-2024-002',
    companyName: 'Global Enterprises',
    companyGst: 'GSTIN987654321',
    orderByName: 'Priya Sharma',
    orderByEmail: 'priya@globalent.com',
    orderByContact: '+91 9876543211',
    currentStatus: 'Accepted',
    subTotal: 120000,
    gstTotal: 21600,
    totalAmount: 141600,
    billingAddress: '789, Business Park, Sector 48, Gurugram, Haryana - 122018',
    deliveryAddress: '789, Business Park, Sector 48, Gurugram, Haryana - 122018',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
    items: [
      {
        _id: 'item2',
        name: 'HP Desktop Workstation',
        unitPrice: 60000,
        quantity: 2,
        gstPercentage: 18,
        subTotal: 120000,
        gstTotal: 21600,
        totalPrice: 141600
      }
    ],
    expectedDeliveryDate: '2024-01-22',
    priority: 'Medium',
    paymentTerms: 'Advance payment'
  },
];

export function VendorOrderList({ onViewOrder }) {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Accepted', label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.currentStatus === 'Pending').length,
    accepted: orders.filter(o => o.currentStatus === 'Accepted').length,
    rejected: orders.filter(o => o.currentStatus === 'Rejected').length
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setOrders(dummyOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAcceptOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId
          ? { ...order, currentStatus: 'Accepted', updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const handleRejectOrder = (orderId, reason) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId
          ? { ...order, currentStatus: 'Rejected', rejectionReason: reason, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getStatusConfig = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.currentStatus === statusFilter;
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderByName?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading vendor orders...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Vendor Order Management</h1>
            <p className="text-gray-600 mt-1">Review and manage incoming orders</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
          </div>
        </div>
      </div>

      {/* Filters */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by order ID, company, or customer..."
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
          const statusConfig = getStatusConfig(order.currentStatus);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.orderId}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {order.currentStatus}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {order.priority} Priority
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                      {order.companyName}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2 flex-shrink-0" />
                      {order.orderByName}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IndianRupee className="h-4 w-4 mr-2 flex-shrink-0" />
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      Order: {formatDate(order.createdAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      Delivery: {formatDate(order.expectedDeliveryDate)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                      {order.paymentTerms}
                    </div>
                  </div>

                  {order.rejectionReason && (
                    <div className="flex items-start p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-red-800">Rejection Reason: </span>
                        <span className="text-sm text-red-700">{order.rejectionReason}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="flex items-center justify-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  {order.currentStatus === 'Pending' && (
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
                  )}
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
    </Layout>
  );
}