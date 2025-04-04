import React, { useState, useEffect, useRef } from "react";
import CategoryService from "@/services/admin/categoryService";
import { Category } from "@/types/category";

interface CategorySelectProps {
  isSales: boolean | undefined;
  onCategoryChange: (categoryIds: number[]) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  isSales,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories(1, 10, "", isSales);
        setCategories(data.data);
      } catch (error) {
        setError("Lỗi khi lấy danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [isSales]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleApplyFilter = () => {
    onCategoryChange(selectedCategories);
    setIsDropdownOpen(false);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Nút mở dropdown */}
      <button
        className="w-full p-3 bg-white shadow-md rounded-lg flex justify-between items-center hover:bg-gray-100 transition outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        Chọn danh mục
        <span className="ml-2">▼</span>
      </button>

      {/* Dropdown danh mục */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 shadow-lg rounded z-10 p-4">
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              >
                <input
                  type="checkbox"
                  value={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                  className="accent-blue-500"
                />
                {category.name}
              </label>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsDropdownOpen(false)}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleApplyFilter}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
