import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import axiosInstance from '../../../services/axiosInstance';
import {
  Building2,
  Users,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Edit3
} from 'lucide-react';

const PartnerProfile = () => {
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/vendor/profile');
        
        if (response.data.success) {
          setPartnerData(response.data.vendor);
        } else {
          setError('Failed to fetch partner profile');
        }
      } catch (err) {
        console.error('Error fetching partner profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch partner profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerProfile();
    window.scrollTo(0, 0);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVerificationStatus = (isVerified) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Calendar className="w-3 h-3 mr-1" />
          Pending Verification
        </span>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // No data state
  if (!partnerData) {
    return (
      <Layout>
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 text-center">
            <p className="text-sm md:text-base text-gray-500">No partner profile data available</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {partnerData.legelName || partnerData.companyName}
                </h1>
                {getVerificationStatus(partnerData.isVerified)}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-600">
                {partnerData.categories && partnerData.categories.length > 0 && (
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {partnerData.categories.join(', ')}
                  </div>
                )}
                {partnerData.employeeCount && (
                  <div className="flex items-center">
                    <Users className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {partnerData.employeeCount} Employees
                  </div>
                )}
                {partnerData.lastYearTurnover && (
                  <div className="flex items-center">
                    <Building2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {formatCurrency(partnerData.lastYearTurnover)}
                  </div>
                )}
              </div>
            </div>
         
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
              Company Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-600">Legal Name</label>
                <p className="text-sm md:text-base text-gray-900 font-medium break-words">
                  {partnerData.legelName || partnerData.companyName || "—"}
                </p>
              </div>
              {partnerData.gstin && (
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">GSTIN</label>
                  <p className="text-sm md:text-base text-gray-900 font-mono break-all">
                    {partnerData.gstin}
                  </p>
                </div>
              )}
              {partnerData.employeeCount && (
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center">
                    <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Employee Count
                  </label>
                  <p className="text-sm md:text-base text-gray-900">{partnerData.employeeCount}</p>
                </div>
              )}
              {partnerData.lastYearTurnover && (
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">Last Year Turnover</label>
                  <p className="text-sm md:text-base text-gray-900 font-semibold">
                    {formatCurrency(partnerData.lastYearTurnover)}
                  </p>
                </div>
              )}
              {partnerData.experience && (
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-sm md:text-base text-gray-900">{partnerData.experience} years</p>
                </div>
              )}
            </div>

            {/* Categories and Sub Categories */}
            {(partnerData.categories?.length > 0 || partnerData.subCategories?.length > 0) && (
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {partnerData.categories?.length > 0 && (
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-600">Categories</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {partnerData.categories.map((category, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {partnerData.subCategories?.length > 0 && (
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-600">Sub Categories</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {partnerData.subCategories.map((subCategory, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                            {subCategory}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <User className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                Point of Contact
              </h2>
              <div className="space-y-3">
                {partnerData.spocName && (
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-600">Name</label>
                    <p className="text-sm md:text-base text-gray-900 font-medium break-words">
                      {partnerData.spocName}
                    </p>
                  </div>
                )}
                {partnerData.designation && (
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-600">Designation</label>
                    <p className="text-sm md:text-base text-gray-900 break-words">
                      {partnerData.designation}
                    </p>
                  </div>
                )}
                {partnerData.spocContact && (
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center">
                      <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      Contact
                    </label>
                    <p className="text-sm md:text-base text-gray-900 font-mono">
                      {partnerData.spocContact}
                    </p>
                  </div>
                )}
                {partnerData.spocEmail && (
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      Email
                    </label>
                    <p className="text-sm md:text-base text-gray-900 break-all">
                      {partnerData.spocEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Verification & Timeline */}
            <div className="space-y-4 md:space-y-6">
              {/* Verification Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                  Verification Status
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs md:text-sm text-gray-700">Profile Verification</span>
                    {getVerificationStatus(partnerData.isVerified)}
                  </div>
                  {partnerData.isAadhaarVerified !== undefined && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs md:text-sm text-gray-700">Aadhaar Verification</span>
                      {getVerificationStatus(partnerData.isAadhaarVerified)}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {(partnerData.createdAt || partnerData.updatedAt) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                    Timeline
                  </h2>
                  <div className="space-y-3">
                    {partnerData.createdAt && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-600">Created</label>
                        <p className="text-sm md:text-base text-gray-900">
                          {formatDate(partnerData.createdAt)}
                        </p>
                      </div>
                    )}
                    {partnerData.updatedAt && (
                      <div>
                        <label className="text-xs md:text-sm font-medium text-gray-600">Last Updated</label>
                        <p className="text-sm md:text-base text-gray-900">
                          {formatDate(partnerData.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {(partnerData.billingAddress || partnerData.warehouseAddress) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                Address Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {partnerData.billingAddress && (
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-600 mb-2 block">
                      Billing Address
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm md:text-base text-gray-900 mb-1 break-words">
                        {partnerData.billingAddress}
                      </p>
                      {(partnerData.city || partnerData.state || partnerData.pincode) && (
                        <p className="text-xs md:text-sm text-gray-600">
                          {[partnerData.city, partnerData.state, partnerData.pincode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {partnerData.warehouseAddress && (
                  <div>
                    <label className="text-xs md:text-sm font-medium text-gray-600 mb-2 block">
                      Warehouse Address
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm md:text-base text-gray-900 break-words">
                        {partnerData.warehouseAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Directors Information */}
          {(partnerData.director1Name || partnerData.director2Name) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                Directors
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {partnerData.director1Name && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs md:text-sm font-medium text-gray-600">Director 1</label>
                    <p className="text-sm md:text-base text-gray-900 font-medium break-words">
                      {partnerData.director1Name}
                    </p>
                  </div>
                )}
                {partnerData.director2Name && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs md:text-sm font-medium text-gray-600">Director 2</label>
                    <p className="text-sm md:text-base text-gray-900 font-medium break-words">
                      {partnerData.director2Name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PartnerProfile;