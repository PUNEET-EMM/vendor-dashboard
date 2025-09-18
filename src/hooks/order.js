import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrderRequests, fetchVendorOrders, updateOrderProgressApi, updateOrderRequestStatusApi } from "../services/api/order";

export const useOrderRequests = () => {
  return useQuery({
    queryKey: ['orderRequests'],
    queryFn: fetchOrderRequests,
    onSuccess: (data) => {
      console.log("Order requests fetched successfully:", data.length, "requests");
    },
    onError: (error) => {
      console.error("Failed to fetch order requests:", error.message);
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10, 
  });
};


export const useVendorOrders = () => {
  return useQuery({
    queryKey: ['vendorOrders'],
    queryFn: fetchVendorOrders,
    onSuccess: (data) => {
      console.log("Vendor orders fetched successfully:", data.length, "orders");
    },
    onError: (error) => {
      console.error("Failed to fetch vendor orders:", error.message);
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10, 
  });
};


export const useUpdateOrderProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateOrderProgressApi,
    onSuccess: (data, variables) => {
      console.log(`Order progress updated successfully to: ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
    },
    onError: (error, variables) => {
      console.error(`Failed to update order progress to ${variables.status}:`, error.message);
    },
  });
};



export const useUpdateOrderRequestStatus = () => {
  return useMutation({
    mutationFn: updateOrderRequestStatusApi,
    onSuccess: (data, variables) => {
      console.log(`Order request status updated successfully to: ${variables.status}`);
    },
    onError: (error, variables) => {
      console.error(`Failed to update order request status to ${variables.status}:`, error.message);
    },
  });
};