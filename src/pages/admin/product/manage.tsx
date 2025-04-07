import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/admin/Search/SearchBar";
import IsSalesDropdown from "@/components/admin/Filter/IsSalesDropdown";
import CategorySelect from "@/components/admin/Filter/CategorySelect";
import Pagination from "@/components/admin/Pagination/Pagination";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import SortByDropdown from "@/components/admin/Filter/SortByDropdown";

import ProductService from "@/services/admin/productService";
import { Product } from "@/types/product";

const ManageProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filterSales, setFilterSales] = useState<boolean | undefined>(
    undefined
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "price_asc" | "price_desc" | "best_selling"
  >("newest");

  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [page, search, filterSales, selectedCategories, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAllProducts(
        page,
        5,
        search,
        filterSales,
        selectedCategories,
        sortBy
      );
      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const toggleProductStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (
        window.confirm(`Bạn có chắc chắn thay đổi trạng thái sản phẩm #${id}?`)
      ) {
        await ProductService.updateProductStatus(id);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id
              ? { ...product, is_sales: !currentStatus }
              : product
          )
        );
        toast.success("Đã thay đổi trạng thái sản phẩm!");
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái sản phẩm thất bại!");
    }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm #${id}?`)) {
      try {
        await ProductService.deleteProduct(id);
        setProducts((prev) => prev.filter((product) => product.id !== id));
        toast.success("Xóa sản phẩm thành công!");
      } catch (error) {
        toast.error("Xóa sản phẩm thất bại!");
      }
    }
  };
  const handleCategoryChange = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          Quản lý Sản phẩm
        </h1>

        {/* {Search Bar} */}
        <div className="flex items-center gap-4 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm theo tên sản phẩm..."
          />

          {/* Lọc trạng thái bán */}
          <div className="flex gap-4 items-center">
            <IsSalesDropdown
              filterSales={filterSales}
              setFilterSales={setFilterSales}
            />
          </div>

          {/* Sắp xếp theo */}
          <div className="flex gap-4 items-center">
            <SortByDropdown selectedSortBy={sortBy} onSortChange={setSortBy} />
          </div>

          {/* Danh mục sản phẩm */}
          <div className="w-96">
            <CategorySelect
              isSales={true}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* {Table} */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Ảnh</th>
                <th className="p-3">Tên sản phẩm</th>
                <th className="p-3">Giá</th>
                <th className="p-3 text-center">Đang bán</th>
                <th className="p-1">Số lượng</th>
                <th className="p-1">Đã bán</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">{product.id}</td>
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt="Product Image"
                      className="w-10 h-10 rounded-full "
                    />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.price} VNĐ</td>

                  <td className="p-3 flex justify-center">
                    <Switch
                      checked={product.is_sales}
                      onChange={() =>
                        toggleProductStatus(product.id, product.is_sales)
                      }
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner ${
                        product.is_sales ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                          product.is_sales ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </Switch>
                  </td>
                  <td className="p-1">{product.stock}</td>
                  <td className="p-1">{product.sold_quantity}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>

                    <button
                      onClick={() =>
                        router.push(`/admin/product/${product.id}`)
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Chi tiết
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

        <button
          onClick={() => router.push("/admin/product/add")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
};

export default ManageProduct;
