import React from "react";

interface IsSalesDropdownProps {
  filterSales: boolean | undefined;
  setFilterSales: (value: boolean | undefined) => void;
}

const IsSalesDropdown: React.FC<IsSalesDropdownProps> = ({
  filterSales,
  setFilterSales,
}) => {
  return (
    <div className="relative bg-white shadow-md rounded-lg p-2 w-36">
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
        className="bg-transparent outline-none text-gray-700 w-full"
      >
        <option value="">Tất cả</option>
        <option value="true">Đang bán</option>
        <option value="false">Chưa bán</option>
      </select>
    </div>
  );
};

export default IsSalesDropdown;
