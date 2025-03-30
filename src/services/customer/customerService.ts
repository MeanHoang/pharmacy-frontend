import axios from "axios";
import { Customer } from "@/types/customer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/customer`,
});

// Interceptor để tự động thêm token vào headers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    console.log("Token hiện tại:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const CustomerService = {
  getAllCustomers: async (
    page: number = 1,
    limit: number = 5,
    search: string = ""
  ) => {
    try {
      const response = await apiClient.get("/", {
        params: { page, limit, search },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createCustomer: async (CustomerData: Customer) => {
    try {
      const response = await apiClient.post("/create", CustomerData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating Customer:", error);
      throw error;
    }
  },

  updateCustomer: async (id: number, CustomerData: Partial<Customer>) => {
    try {
      const response = await apiClient.put(`/${id}`, CustomerData);
      return response.data;
    } catch (error) {
      console.error("Error updating Customer:", error);
      throw error;
    }
  },

  deleteCustomer: async (id: number) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Customer:", error);
      throw error;
    }
  },

  getCustomerById: async (id: number) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Customer by ID:", error);
      throw error;
    }
  },

  resetPassword: async (id: number) => {
    try {
      const response = await apiClient.patch(`/${id}/reset-password`);
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  updateCustomerStatus: async (id: number) => {
    try {
      const response = await apiClient.patch(`/status/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error updating admin status:", error);
      throw error;
    }
  },
};

export default CustomerService;
