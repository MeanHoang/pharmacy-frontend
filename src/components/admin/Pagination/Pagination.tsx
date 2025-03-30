import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const getPages = () => {
    let pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between w-full mt-6">
      {/* Thông báo vị trí trang bên trái */}
      <p className="text-gray-600 text-sm">
        Trang {currentPage} / {totalPages}
      </p>

      {/* Nút chuyển trang bên phải */}
      <ul className="flex items-center gap-2 bg-white shadow-md rounded-lg p-2">
        {/* Nút Previous */}
        <li>
          <button
            className={`px-3 py-2 text-sm rounded-md transition-all duration-300 ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
          >
            &laquo;
          </button>
        </li>

        {/* Hiển thị danh sách số trang */}
        {getPages().map((i) => (
          <li key={i}>
            <button
              className={`px-3 py-2 text-sm rounded-md transition-all duration-300 ${
                i === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </button>
          </li>
        ))}

        {/* Nút Next */}
        <li>
          <button
            className={`px-3 py-2 text-sm rounded-md transition-all duration-300 ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
