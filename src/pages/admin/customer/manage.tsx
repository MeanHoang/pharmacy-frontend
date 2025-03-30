import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import Pagination from "@/components/admin/Pagination/Pagination";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import CustomerService from "@/services/admin/customerService";
import { Customer } from "@/types/customer";

const ManageCustomer: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAllCustomers(page, 5, search);
      setCustomers(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const toggleCustomerStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (
        window.confirm(
          `Bạn có chắc chắn thay đổi quyền truy cập tài khoản #${id}?`
        )
      ) {
        await CustomerService.updateCustomerStatus(id);
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.id === id
              ? { ...customer, is_active: !currentStatus }
              : customer
          )
        );
        toast.success("Đã thay đổi quyền truy cập!");
      }
    } catch (error) {
      toast.error("Thay đổi quyền truy cập thất bại!");
    }
  };

  const deleteCustomer = async (id: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khách hàng #${id}?`)) {
      try {
        await CustomerService.deleteCustomer(id);
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        toast.success("Xóa khách hàng thành công!");
      } catch (error) {
        toast.error("Xóa khách hàng thất bại!");
      }
    }
  };

  const resetPassword = async (id: number) => {
    if (window.confirm(`Bạn có muốn đặt lại mật khẩu cho khách hàng #${id}?`)) {
      try {
        await CustomerService.resetPassword(id);
        toast.success("Đã đặt lại mật khẩu!");
      } catch (error) {
        toast.error("Đặt lại mật khẩu thất bại!");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          Quản lý Khách hàng
        </h1>

        {/* Ô tìm kiếm */}
        <div className="mb-4 flex items-center gap-2 px-4 py-2 shadow-md rounded-full bg-white w-80">
          <Search className="text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, SDT..."
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 focus:text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Bảng danh sách khách hàng */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Ảnh</th>
                <th className="p-3">Tên</th>
                <th className="p-3">Email</th>
                <th className="p-3">SDT</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3">Ngày đăng ký</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr
                  key={customer.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">{customer.id}</td>
                  <td className="p-3">
                    <img
                      src={customer.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>
                  <td className="p-3">{customer.fullname}</td>
                  <td className="p-3">{customer.email}</td>

                  <td className="p-3">
                    {customer.phonenumber || "Chưa cập nhật"}
                  </td>

                  {/* Trạng thái */}
                  <td className="p-3 flex justify-center">
                    <Switch
                      checked={customer.is_active}
                      onChange={() =>
                        toggleCustomerStatus(customer.id, customer.is_active)
                      }
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner ${
                        customer.is_active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                          customer.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </Switch>
                  </td>

                  <td className="p-3">{customer.created_at}</td>

                  {/* Thao tác */}
                  <td className="p-3 flex gap-2">
                    {/* Xóa */}
                    <button
                      onClick={() => deleteCustomer(customer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>

                    {/* Đặt lại mật khẩu */}
                    <button
                      onClick={() => resetPassword(customer.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Đặt lại mật khẩu
                    </button>

                    {/* Xem chi tiết */}
                    <button
                      onClick={() =>
                        router.push(`/admin/customers/detail/${customer.id}`)
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

        {/* Phân trang */}
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

export default ManageCustomer;
