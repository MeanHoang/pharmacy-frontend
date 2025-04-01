import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search } from "lucide-react";

import Pagination from "@/components/admin/Pagination/Pagination";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import CategoryService from "@/services/admin/categoryService";
import { Category } from "@/types/category";

const ManageCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filterSales, setFilterSales] = useState<boolean | undefined>(
    undefined
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedCategory, setEditedCategory] = useState<Partial<Category>>({});

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, [page, search, filterSales]);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getAllCategories(
        page,
        5,
        search,
        filterSales
      );
      //   console.log(">>>check res: ", response.data);
      setCategories(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const toggleCategoryStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (
        window.confirm(
          `Bạn có chắc chắn thay đổi trạng thái bán hàng cho danh mục #${id}?`
        )
      ) {
        await CategoryService.updateStatus(id);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === id
              ? { ...category, is_sales: !currentStatus }
              : category
          )
        );
        toast.success("Đã thay đổi trạng thái bán hàng!");
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái thất bại!");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditedCategory({ ...category });
  };

  const handleSave = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi?")) return;
    try {
      await CategoryService.updateCategory(id, editedCategory);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? { ...category, ...editedCategory } : category
        )
      );
      toast.success("Cập nhật danh mục thành công!");
      setEditingId(null);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCategory({});
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục #${id}?`)) return;
    try {
      await CategoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast.success("Xóa danh mục thành công!");
    } catch (error) {
      toast.error("Xóa danh mục thất bại!");
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name) {
        toast.error("Vui lòng nhập tên danh mục!");
        return;
      }
      await CategoryService.createCategory(newCategory);
      fetchCategories();
      toast.success("Thêm danh mục thành công!");
      setShowModal(false);
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      toast.error("Thêm danh mục thất bại!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          Quản lý Danh Mục
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex items-center bg-white shadow-md rounded-lg p-2 w-70">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên danh mục..."
              className="w-full bg-transparent outline-none text-gray-700 ml-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative bg-white shadow-md rounded-lg p-2">
            <select
              value={filterSales === undefined ? "" : String(filterSales)}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setFilterSales(undefined);
                } else {
                  setFilterSales(value === "true");
                }
              }}
              className="bg-transparent outline-none text-gray-700"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang bán</option>
              <option value="false">Chưa bán</option>
            </select>
          </div>
        </div>

        {/* {Table} */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Tên danh mục</th>
                <th className="p-3">Mô tả</th>
                <th className="p-3 text-center">Trạng thái bán hàng</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">{category.id}</td>
                  <td className="p-3">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editedCategory.name || ""}
                        onChange={(e) =>
                          setEditedCategory({
                            ...editedCategory,
                            name: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editedCategory.description || ""}
                        onChange={(e) =>
                          setEditedCategory({
                            ...editedCategory,
                            description: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      category.description || "-"
                    )}
                  </td>
                  <td className="p-3 flex justify-center">
                    <Switch
                      checked={category.is_sales}
                      onChange={() =>
                        toggleCategoryStatus(category.id, category.is_sales)
                      }
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner ${
                        category.is_sales ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                          category.is_sales ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </Switch>
                  </td>
                  <td className="p-3">{category.created_at}</td>

                  <td className="p-3 flex gap-2">
                    {editingId === category.id ? (
                      <button
                        onClick={() => handleSave(category.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Lưu
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            setCurrentPage={setPage}
          />
        </div>
        <div className="mt-4 flex justify-left">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Thêm tài khoản
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-500">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Thêm tài khoản mới</h2>
              <input
                type="text"
                placeholder="Tên danh mục"
                className="w-full mb-2 p-2 border rounded"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Mô tả"
                className="w-full mb-2 p-2 border rounded"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCategory;
