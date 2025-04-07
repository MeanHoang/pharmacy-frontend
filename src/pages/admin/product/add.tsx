import React, { useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import CategoryDropdown from "@/components/admin/Filter/CategoryDropdown";
import ProductService from "@/services/admin/productService";
import { Product } from "@/types/product";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
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
    category_id: 0,
    is_sales: false,
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

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
      const response = await ProductService.createProduct(formData, imageFile);
      toast.success("Sản phẩm đã được thêm thành công!");
      router.push("/admin/product/manage");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Lỗi khi thêm sản phẩm. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/product/manage");
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Thêm sản phẩm mới
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-8"
        >
          {/* === CỘT 1 === */}
          <div className="space-y-4 col-span-4">
            {/* Hàng 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block font-medium text-gray-700"
                >
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="brand"
                  className="block font-medium text-gray-700"
                >
                  Nhãn hàng
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập tên nhãn hàng"
                />
              </div>
            </div>

            {/* Hàng 2 */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700"
                >
                  Mô tả
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập mô tả ngắn"
                />
              </div>
            </div>

            {/* Hàng 3 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="origin"
                  className="block font-medium text-gray-700"
                >
                  Xuất xứ
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập xuất xứ"
                />
              </div>
              <div>
                <label
                  htmlFor="packaging"
                  className="block font-medium text-gray-700"
                >
                  Dạng đóng gói
                </label>
                <input
                  type="text"
                  id="packaging"
                  name="packaging"
                  value={formData.packaging}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập dạng đóng gói"
                />
              </div>
              <div>
                <label
                  htmlFor="specification"
                  className="block font-medium text-gray-700"
                >
                  Quy cách
                </label>
                <input
                  type="text"
                  id="specification"
                  name="specification"
                  value={formData.specification}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập quy cách"
                />
              </div>
            </div>

            {/* Hàng 4 */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="indications"
                  className="block font-medium text-gray-700"
                >
                  Chỉ định sử dụng
                </label>
                <textarea
                  id="indications"
                  name="indications"
                  value={formData.indications}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập chỉ định sử dụng"
                />
              </div>
              <div>
                <label
                  htmlFor="instructions"
                  className="block font-medium text-gray-700"
                >
                  Hướng dẫn sử dụng
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập hướng dẫn sử dụng"
                />
              </div>
            </div>

            {/* Hàng 6 */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="note"
                  className="block font-medium text-gray-700"
                >
                  Thành phần thuốc
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập thành phần thuốc"
                />
              </div>
            </div>
          </div>

          {/* === CỘT 2 === */}
          <div className="flex flex-col mb-4 col-span-2 space-y-4">
            <label
              htmlFor="image"
              className="text-lg font-medium text-gray-700"
            >
              Hình ảnh sản phẩm
            </label>
            <div className="flex justify-center items-center mb-4 relative">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-60 h-60 rounded-lg overflow-hidden border-1 border-gray-300 bg-gray-200 flex items-center justify-center">
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
            {/* Hàng 2 */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block font-medium text-gray-700"
                >
                  Danh mục sản phẩm
                </label>
                <CategoryDropdown
                  onCategoryChange={handleCategoryChange}
                  isSales={true}
                />
              </div>
            </div>
            {/* Hàng 3 */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block font-medium text-gray-700"
                >
                  Giá tiền
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block font-medium text-gray-700"
                >
                  Số lượng
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label
                  htmlFor="discount"
                  className="block font-medium text-gray-700"
                >
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            {/* Hàng 4 */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="note"
                  className="block font-medium text-gray-700"
                >
                  Lưu ý
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nhập lưu ý"
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="col-span-1 md:col-span-2 flex justify-between space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang thêm..." : "Thêm sản phẩm"}
            </button>
            <button
              type="button"
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
