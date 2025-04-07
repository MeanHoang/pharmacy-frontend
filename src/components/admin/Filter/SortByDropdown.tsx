import React from "react";

type SortByOption = "newest" | "price_asc" | "price_desc" | "best_selling";

interface SortByDropdownProps {
  selectedSortBy: SortByOption;
  onSortChange: (value: SortByOption) => void;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({
  selectedSortBy,
  onSortChange,
}) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg p-2 w-30">
      <select
        id="sortBy"
        value={selectedSortBy}
        onChange={(e) => onSortChange(e.target.value as SortByOption)}
        className="bg-transparent outline-none text-gray-700 w-full"
      >
        <option value="newest">Mới nhất</option>
        <option value="price_asc">Giá giảm dần</option>
        <option value="price_desc">Giá tăng dần</option>
        <option value="best_selling">Bán chạy</option>
      </select>
    </div>
  );
};

export default SortByDropdown;
