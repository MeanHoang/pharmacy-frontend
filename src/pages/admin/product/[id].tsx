import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import CategoryDropdown from "@/components/admin/Filter/CategoryDropdown";
import ProductService from "@/services/admin/productService";
import { Product } from "@/types/product";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      ProductService.getProductById(id as string).then((res) => {
        setProduct(res.data);
        setImagePreview(res.data.image);
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setProduct((prev) => ({ ...prev, category_id: categoryId }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append("image", file);
      }
      Object.entries(product).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      await ProductService.updateProduct(id as string, formData);
      toast.success("Cập nhật sản phẩm thành công!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-1 p-8 w-full bg-gray-50">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Chi tiết sản phẩm
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-gray-700">
              Hình ảnh sản phẩm
            </label>
            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 mb-2">
              <img
                src={imagePreview || "/default-image.jpg"}
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2"
                accept="image/*"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-base font-normal text-gray-700">
                Tên sản phẩm *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={product.name || ""}
                  onChange={handleChange}
                  className="border p-2"
                />
              ) : (
                <p>{product.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-base font-normal text-gray-700">
                Giá tiền *
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={product.price || ""}
                  onChange={handleChange}
                  className="border p-2"
                />
              ) : (
                <p>{product.price?.toLocaleString()}đ</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-base font-normal text-gray-700">
                Danh mục *
              </label>
              {isEditing ? (
                <CategoryDropdown
                  selectedCategory={product.category_id || 1}
                  onChange={handleCategoryChange}
                />
              ) : (
                <p>{product.category?.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-base font-normal text-gray-700">
                Thương hiệu
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="brand"
                  value={product.brand || ""}
                  onChange={handleChange}
                  className="border p-2"
                />
              ) : (
                <p>{product.brand}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-base font-normal text-gray-700">
                Xuất xứ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="origin"
                  value={product.origin || ""}
                  onChange={handleChange}
                  className="border p-2"
                />
              ) : (
                <p>{product.origin}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-base font-normal text-gray-700">
                Mô tả
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={product.description || ""}
                  onChange={handleChange}
                  className="border p-2 h-24"
                />
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
