import axiosInstance from "../axiosInstance";

export const loginApi = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login/vendor", {
    email,
    password,   
  },{ skipAuth: true });
  return response.data; 
};