import axios from "axios";
import { Product } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/product`,
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

const ProductService = {
  getAllProducts: async (
    page: number = 1,
    limit: number = 5,
    search: string = "",
    isSales?: boolean,
    categories?: number[],
    sortBy?: "newest" | "price_asc" | "price_desc" | "best_selling"
  ) => {
    try {
      const params: any = { page, limit, search };

      // Chỉ thêm filterSales nếu isSales có giá trị
      if (isSales !== undefined) {
        params.isSales = isSales ? "1" : "0";
      }

      if (categories && categories.length > 0) {
        params.categories = categories.join(",");
      }

      if (sortBy) {
        params.sortBy = sortBy;
      }
      const response = await apiClient.get("/", { params });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createProduct: async (productData: Partial<Product>, imageFile?: File) => {
    const formData = new FormData();

    // Ensure `key` is a valid property of `Product`
    for (const key in productData) {
      if (productData.hasOwnProperty(key)) {
        // Kiểm tra rằng key là khóa hợp lệ của Product
        if (key in productData) {
          formData.append(
            key as keyof Product,
            productData[key] as string | Blob
          );
        }
      }
    }

    // Append the image file to formData if it's provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await apiClient.post("/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  updateProduct: async (id: number, productData: Partial<Product>) => {
    try {
      const response = await apiClient.put(`/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  },

  updateProductStatus: async (id: number) => {
    try {
      const response = await apiClient.patch(`/status/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  },
};

export default ProductService;
