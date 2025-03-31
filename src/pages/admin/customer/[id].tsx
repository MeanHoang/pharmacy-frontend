import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import CustomerService from "@/services/admin/customerService";

// import { Address } from "@/types/address";
// import { Order } from "@/types/order";
import { Customer } from "@/types/customer";

const CustomerDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (id) {
      fetchCustomerDetails(Number(id));
    }
  }, [id]);

  const fetchCustomerDetails = async (customerId: number) => {
    try {
      const data = await CustomerService.getCustomerById(customerId);
      setCustomer(data);
    } catch (error) {
      toast.error("Không thể tải thông tin khách hàng!");
    }
  };

  if (!customer) {
    return <p className="text-center mt-10">Đang tải thông tin...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          Chi tiết Khách hàng #{customer.id}
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center gap-6">
            <img
              src={customer.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {customer.fullname}
              </h2>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">
                Số điện thoại: {customer.phonenumber || "Chưa cập nhật"}
              </p>
              <p className="text-gray-600">
                Giới tính: {customer.gender || "Chưa cập nhật"}
              </p>
              <p className="text-gray-600">
                Google ID: {customer.google_id || "Chưa cập nhật"}
              </p>
              <p className="text-gray-600">
                Ngày sinh:{" "}
                {customer.birthday
                  ? customer.birthday.toLocaleDateString()
                  : "Chưa cập nhật"}
              </p>
              <p
                className={`text-gray-600 font-semibold ${
                  customer.is_active ? "text-green-500" : "text-red-500"
                }`}
              >
                Quyền truy cập: {customer.is_active ? "Hoạt động" : "Bị khóa"}
              </p>
              <p
                className={`text-gray-600 font-semibold ${
                  customer.is_verified ? "text-green-500" : "text-red-500"
                }`}
              >
                Trạng thái xác minh:{" "}
                {customer.is_verified ? "Đã xác minh" : "Chưa xác minh"}
              </p>
              <p className="text-gray-600">
                Ngày tạo tài khoản: {customer.created_at || "Chưa cập nhật"}
              </p>
            </div>
          </div>

          {/* Danh sách địa chỉ */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Địa chỉ</h2>
            {customer.addresses && customer.addresses.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {customer.addresses.map((address) => (
                  <li key={address.id} className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700 font-medium">
                      {address.recipient_name}
                    </p>
                    <p className="text-gray-600">
                      {address.address}, {address.ward}, {address.district},{" "}
                      {address.city}
                    </p>
                    <p className="text-gray-600">SĐT: {address.phonenumber}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Không có địa chỉ nào.</p>
            )}
          </div>

          {/* Danh sách đơn hàng */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Đơn hàng</h2>
            {customer.orders && customer.orders.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {customer.orders.map((order) => (
                  <li key={order.id} className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-gray-700 font-medium">
                      Mã đơn hàng: #{order.id}
                    </p>
                    <p className="text-gray-600">
                      Tổng tiền: {order.total_price.toLocaleString()} VNĐ
                    </p>
                    <p className="text-gray-600">Trạng thái: {order.status}</p>
                    <p className="text-gray-600">
                      Phương thức thanh toán: {order.payment_method}
                    </p>
                    <p className="text-gray-600">
                      Địa chỉ giao hàng: {order.address}, {order.ward},{" "}
                      {order.district}, {order.city}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Không có đơn hàng nào.</p>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push("/admin/customer/manage")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Quay lại
            </button>
            <button
              onClick={() => toast.info("Chức năng đang phát triển!")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
