import React, { useState, useEffect } from "react";
import CategoryService from "@/services/admin/categoryService";
import { Category } from "@/types/category";

interface CategoryDropdownProps {
  isSales: number;
  onCategoryChange: (categoryId: number) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  isSales,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories(1, 10, "", isSales);
        setCategories(data.data); // Assuming `data.data` contains the categories
      } catch (error) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isSales]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = parseInt(e.target.value);
    if (!isNaN(selectedCategoryId)) {
      onCategoryChange(selectedCategoryId); // Call onCategoryChange with the selected category ID
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select
      onChange={handleChange}
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    >
      <option value="">Danh mục sản phẩm</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
