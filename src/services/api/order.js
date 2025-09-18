
import axiosInstance from "../axiosInstance";

export const fetchOrderRequests = async () => {
  try {
    const response = await axiosInstance.get('/vendor/orders/request');

    if (response.data.success) {
      return response.data.orderRequest || [];
    } else {
      throw new Error('Failed to fetch order requests');
    }
  } catch (error) {
    if (error.response?.status === 404 &&
      (error.response?.data?.message === "No order request found!" ||
        error.response?.data?.success === false)) {
      return [];
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch order requests');
    }
  }
};

export const fetchVendorOrders = async () => {
  try {
    const response = await axiosInstance.get('/vendor/orders');

    if (response.data.success) {
      return response.data.orderRequest || response.data.vendorOrders || [];
    } else {
      throw new Error('Failed to fetch vendor orders');
    }
  } catch (error) {
    if (error.response?.status === 404 &&
      (error.response?.data?.message === "No order request found!" ||
        error.response?.data?.success === false)) {
      return [];
    } else {
      throw new Error(error.response?.data?.message || 'Failed to fetch vendor orders');
    }
  }
};


export const updateOrderRequestStatusApi = async ({ requestId, status }) => {
  try {

    const response = await axiosInstance.patch(
      `/vendor/orders/request/${requestId}/status`,
      { status }
    );

    console.log(response.data)
    return response
    // if (response.data.success) {
    //   return response.data;
    // } else {
    //   throw new Error('Failed to update order request status');
    // }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order request status');
  }
};


export const updateOrderProgressApi = async ({ orderId, status, otp = '' }) => {
  try {
    const payload = {
      status,
      otp
    };

    const response = await axiosInstance.patch(
      `/vendor/orders/${orderId}/progress`,
      payload
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('Failed to update order progress');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order progress');
  }
};