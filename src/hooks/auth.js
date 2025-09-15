import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log("Logged in:", data.message);
      localStorage.setItem("vendortoken", data.token); 
    },
    onError: (error) => {
      console.error("Login failed:", error.response?.data || error.message);
    },
  });
};