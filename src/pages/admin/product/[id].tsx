import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import CategoryDropdown from "@/components/admin/Filter/CategoryDropdown";
import ProductService from "@/services/admin/productService";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const ProductUpdate: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    stock: 0,
    discount: 0,
    packaging: "",
    specification: "",
    indications: "",
    instructions: "",
    origin: "",
    brand: "",
    ingredients: "",
    note: "",
    is_sales: false,
    image: "",
    category: {
      id: 0,
      name: "",
      is_sales: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const productId = Array.isArray(id) ? id[0] : id;
      const numericId = Number(productId);

      if (!isNaN(numericId)) {
        ProductService.getProductById(numericId)
          .then((res) => {
            setFormData(res.data);
            setImagePreview(res.data.image);
          })
          .catch((error) => {
            toast.error("Lỗi khi tải sản phẩm");
          });
      } else {
        toast.error("ID sản phẩm không hợp lệ");
      }
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);

      // Đọc file và hiển thị ảnh preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prevData) => ({
        ...prevData,
        image: file.name,
      }));
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prevData) => ({
      ...prevData,
      category_id: categoryId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await ProductService.updateProduct(id, formData);
      toast.success("Sản phẩm đã được cập nhật thành công!");
      router.push("/admin/product/manage");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Lỗi khi cập nhật sản phẩm. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-1 p-8 w-full bg-gray-50">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Cập nhật sản phẩm
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-lg"
        >
          {/* Xem trước ảnh */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="image"
              className="text-lg font-medium text-gray-700"
            >
              Hình ảnh sản phẩm
            </label>
            <div className="relative">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/dwmhvuxpb/image/upload/v1743486004/image_df_re9yme.jpg"
                    alt="Default"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-base font-normal text-gray-700"
              >
                Tên sản phẩm *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="price"
                className="text-base font-normal text-gray-700"
              >
                Giá tiền *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập giá tiền"
                required
              />
            </div>
          </div>

          {/* Các trường nhập liệu khác */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="stock"
                className="text-lg font-medium text-gray-700"
              >
                Số lượng
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số lượng"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="discount"
                className="text-lg font-medium text-gray-700"
              >
                Giảm giá (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập giảm giá"
              />
            </div>
          </div>

          {/* Các trường nhập liệu dạng textarea */}
          <div className="flex flex-col">
            <label
              htmlFor="indications"
              className="text-lg font-medium text-gray-700"
            >
              Chỉ định sử dụng
            </label>
            <textarea
              id="indications"
              name="indications"
              value={formData.indications}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập chỉ định sử dụng"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="instructions"
              className="text-lg font-medium text-gray-700"
            >
              Hướng dẫn sử dụng
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập hướng dẫn sử dụng"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="ingredients"
              className="text-lg font-medium text-gray-700"
            >
              Thành phần thuốc
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập thành phần thuốc"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="note" className="text-lg font-medium text-gray-700">
              Lưu ý
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lưu ý"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="category"
              className="text-lg font-medium text-gray-700"
            >
              Danh mục
            </label>
            <CategoryDropdown
              onCategoryChange={handleCategoryChange}
              isSales={true}
              selectedCategory={formData.category?.id}
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật Sản Phẩm"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProductUpdate;
