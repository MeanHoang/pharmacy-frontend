import axios from "axios";
import { Admin } from "@/types/admin";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

// Interceptor để tự động thêm token vào headers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const adminToken = localStorage.getItem("adminToken");
    console.log("Token hiện tại:", adminToken);
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
});

const AdminService = {
  getAllAdmins: async (
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

  createAdmin: async (adminData: Admin) => {
    try {
      const response = await apiClient.post("/create", adminData);
      return response.data;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  },

  updateAdmin: async (id: number, adminData: Partial<Admin>) => {
    try {
      const response = await apiClient.put(`/${id}`, adminData);
      return response.data;
    } catch (error) {
      console.error("Error updating admin:", error);
      throw error;
    }
  },

  deleteAdmin: async (id: number) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting admin:", error);
      throw error;
    }
  },

  getAdminById: async (id: number) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin by ID:", error);
      throw error;
    }
  },

  resetPassword: async (id: number) => {
    try {
      const response = await apiClient.patch(`/reset-password/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  updateAdminStatus: async (id: number) => {
    try {
      const response = await apiClient.patch(`/status/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error updating admin status:", error);
      throw error;
    }
  },
};

export default AdminService;
