import axios from "axios";
import { Category } from "@/types/category";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/category`,
});

// Interceptor để tự động thêm token vào headers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
});

const CategoryService = {
  getAllCategories: async (
    page: number = 1,
    limit: number = 10,
    search: string = "",
    isSales: number
  ) => {
    try {
      const params: any = { page, limit, search };

      // Chỉ thêm filterSales nếu isSales có giá trị
      if (isSales !== undefined) {
        params.isSales = isSales ? "1" : "0";
      }
      const response = await apiClient.get("/", { params });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getCategoryById: async (id: number) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw error;
    }
  },

  createCategory: async (categoryData: Partial<Category>) => {
    try {
      const response = await apiClient.post("/create", categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  updateCategory: async (id: number, categoryData: Partial<Category>) => {
    try {
      const response = await apiClient.put(`/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  updateStatus: async (id: number) => {
    try {
      const response = await apiClient.patch(`/status/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error updating category isSales:", error);
      throw error;
    }
  },
};

export default CategoryService;
