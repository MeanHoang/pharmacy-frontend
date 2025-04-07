import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

import SearchBar from "@/components/admin/Search/SearchBar";
import Pagination from "@/components/admin/Pagination/Pagination";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";

import StoreService from "@/services/admin/storeService";
import { Store } from "@/types/store";

const ManageStore: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    fetchStores();
  }, [page, search]);

  const fetchStores = async () => {
    try {
      const response = await StoreService.getAllStores(page, 5, search);
      setStores(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  const toggleStoreStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (
        window.confirm(`Bạn có chắc chắn thay đổi trạng thái cửa hàng #${id}?`)
      ) {
        await StoreService.updateStoreStatus(id);
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === id ? { ...store, is_active: !currentStatus } : store
          )
        );
        toast.success("Đã thay đổi trạng thái cửa hàng!");
      }
    } catch (error) {
      toast.error("Thay đổi trạng thái thất bại!");
    }
  };

  const deleteStore = async (id: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cửa hàng #${id}?`)) {
      try {
        await StoreService.deleteStore(id);
        setStores((prev) => prev.filter((store) => store.id !== id));
        toast.success("Xóa cửa hàng thành công!");
      } catch (error) {
        toast.error("Xóa cửa hàng thất bại!");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          Quản lý Cửa hàng
        </h1>

        {/* {Search Bar} */}
        <div className="flex items-center gap-4 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm theo tên cửa hàng..."
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Tên cửa hàng</th>
                <th className="p-3">Phường(Xã)</th>
                <th className="p-3">Quận(Huyện)</th>
                <th className="p-3">Thành phố</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3">Hotline</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <tr
                  key={store.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">{store.id}</td>
                  <td className="p-3">{store.name}</td>
                  <td className="p-3">{store.district}</td>
                  <td className="p-3">{store.ward}</td>
                  <td className="p-3">{store.city}</td>

                  <td className="p-3 flex justify-center">
                    <Switch
                      checked={store.is_active}
                      onChange={() =>
                        toggleStoreStatus(store.id, store.is_active)
                      }
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner ${
                        store.is_active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                          store.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </Switch>
                  </td>

                  <td className="p-3">{store.phonenumber}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => deleteStore(store.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>

                    <button
                      onClick={() => router.push(`/admin/store/${store.id}`)}
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
      </div>
    </div>
  );
};

export default ManageStore;
