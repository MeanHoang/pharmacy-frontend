import axios, { AxiosError } from "axios";
import { Store } from "@/types/store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/store`,
});

// Interceptor để tự động thêm token vào headers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor xử lý lỗi 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Token có thể đã hết hạn!");
      // Xử lý đăng xuất hoặc refresh token tại đây nếu cần
    }
    return Promise.reject(error);
  }
);

const StoreService = {
  getAllStores: async (
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
      console.error("Error fetching stores:", error);
      throw error;
    }
  },

  getStoreById: async (id: number) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching store by ID:", error);
      throw error;
    }
  },

  createStore: async (storeData: Store) => {
    try {
      const response = await apiClient.post("/create", storeData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  },

  updateStore: async (id: number, storeData: Partial<Store>) => {
    try {
      const response = await apiClient.put(`/${id}`, storeData);
      return response.data;
    } catch (error) {
      console.error("Error updating store:", error);
      throw error;
    }
  },

  deleteStore: async (id: number) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting store:", error);
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

  updateStoreStatus: async (id: number) => {
    try {
      const response = await apiClient.patch(`/status/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error updating store status:", error);
      throw error;
    }
  },
};

export default StoreService;
