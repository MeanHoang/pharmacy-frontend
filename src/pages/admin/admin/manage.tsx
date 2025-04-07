import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Search } from "lucide-react";

import SearchBar from "@/components/admin/Search/SearchBar";
import Pagination from "@/components/admin/Pagination/Pagination";
import AdminSidebar from "@/components/admin/Sidebar/Siderbar";
import AdminService from "@/services/admin/adminService";
import { Admin } from "@/types/admin";

const ManageAdmin: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAdmin, setEditedAdmin] = useState<Partial<Admin>>({});

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newAdmin, setNewAdmin] = useState<Partial<Admin>>({
    username: "",
    fullname: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, [page, search]);

  const fetchAdmins = async () => {
    try {
      const response = await AdminService.getAllAdmins(page, 5, search);
      setAdmins(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  const toggleAdminStatus = async (id: number, currentStatus: boolean) => {
    try {
      if (
        window.confirm(
          `Bạn có chắc chắn thay đổi quyền truy cập tài khoản #${id}?`
        )
      ) {
        await AdminService.updateAdminStatus(id);
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === id ? { ...admin, is_active: !currentStatus } : admin
          )
        );
        toast.success("Đã thay đổi quyền truy cập!");
      }
    } catch (error) {
      toast.error("Thay đổi quyền truy cập thất bại!");
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingId(admin.id);
    setEditedAdmin({ ...admin });
  };

  const handleSave = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi?")) return;
    try {
      await AdminService.updateAdmin(id, editedAdmin);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === id ? { ...admin, ...editedAdmin } : admin
        )
      );
      toast.success("Cập nhật thành công!");
      setEditingId(null);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedAdmin({});
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản #${id}?`)) return;
    try {
      await AdminService.deleteAdmin(id);
      // setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
      fetchAdmins();
      toast.success("Xóa tài khoản thành công!");
    } catch (error) {
      toast.error("Xóa tài khoản thất bại!");
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn đặt lại mật khẩu?")) return;
    try {
      await AdminService.resetPassword(id);
      toast.success("Mật khẩu đã được đặt lại!");
    } catch (error) {
      toast.error("Đặt lại mật khẩu thất bại!");
    }
  };

  const handleAddAdmin = async () => {
    try {
      if (!newAdmin.username || !newAdmin.fullname) {
        toast.error("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      await AdminService.createAdmin(newAdmin);
      fetchAdmins();
      toast.success("Thêm tài khoản thành công!");
      setShowModal(false);
      setNewAdmin({ username: "", fullname: "" });
    } catch (error) {
      toast.error("Thêm tài khoản thất bại!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          Quản lý Admin
        </h1>

        <div className="flex items-center gap-4 mb-6">
          {/* {Search Bar} */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Tìm kiếm theo tên đăng nhập..."
          />
        </div>

        {/* {Table} */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Tên đăng nhập</th>
                <th className="p-3">Họ tên</th>
                <th className="p-3 text-center">Quyền truy cập</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr
                  key={admin.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">{admin.id}</td>
                  <td className="p-3">
                    {editingId === admin.id ? (
                      <input
                        type="text"
                        value={editedAdmin.username || ""}
                        onChange={(e) =>
                          setEditedAdmin({
                            ...editedAdmin,
                            username: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      admin.username
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === admin.id ? (
                      <input
                        type="text"
                        value={editedAdmin.fullname || ""}
                        onChange={(e) =>
                          setEditedAdmin({
                            ...editedAdmin,
                            fullname: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      admin.fullname
                    )}
                  </td>
                  <td className="p-3 flex justify-center">
                    <Switch
                      checked={admin.is_active}
                      onChange={() =>
                        toggleAdminStatus(admin.id, admin.is_active)
                      }
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ease-in-out shadow-inner ${
                        admin.is_active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span className="sr-only">Toggle Status</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                          admin.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </Switch>
                  </td>
                  <td className="p-3">{admin.created_at}</td>
                  <td className="p-3 flex gap-2">
                    {editingId === admin.id ? (
                      <>
                        <button
                          onClick={() => handleSave(admin.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(admin)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => handleResetPassword(admin.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Đặt lại MK
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
                placeholder="Tên đăng nhập"
                className="w-full mb-2 p-2 border rounded"
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Họ tên"
                className="w-full mb-2 p-2 border rounded"
                value={newAdmin.fullname}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, fullname: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Mật khẩu"
                className="w-full mb-2 p-2 border rounded"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
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
                  onClick={handleAddAdmin}
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

export default ManageAdmin;
