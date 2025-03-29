import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiBarChart2,
  FiMessageCircle,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlinePayments } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import { theme } from "./config/theme";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { logout } = useAuth();

  return (
    <div
      className={`${theme.sidebar.bgColor} ${theme.sidebar.textColor} ${
        theme.sidebar.fontClass
      } ${
        isOpen ? theme.sidebar.widthOpen : theme.sidebar.widthClosed
      } h-screen transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="p-4 flex justify-between items-center">
        {isOpen ? (
          <h2 className="text-lg font-bold flex transition-all">
            <span className="text-blue-500">admin</span>
            <span className="text-yellow-500">Pharmacy</span>
          </h2>
        ) : (
          <div className="w-1" />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-4 space-y-3">
        <SidebarItem
          href="/admin/dashboard/page"
          icon={<FiHome />}
          label="Trang chủ"
          isOpen={isOpen}
        />
        <SidebarItem
          title="Quản lý tài khoản"
          icon={<FiUsers />}
          isOpen={isOpen}
          subItems={[
            { label: "Người dùng", href: "/admin/accounts/users" },
            { label: "Cửa hàng", href: "/admin/accounts/stores" },
            { label: "Quản trị", href: "/admin/accounts/admins" },
          ]}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <SidebarItem
          title="Quản lý sản phẩm"
          icon={<FiBox />}
          isOpen={isOpen}
          subItems={[
            { label: "Danh mục", href: "/admin/products/categories" },
            { label: "Sản phẩm", href: "/admin/products/items" },
          ]}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
        <SidebarItem
          href="/admin/orders"
          icon={<FiShoppingCart />}
          label="Quản lý đơn hàng"
          isOpen={isOpen}
        />
        <SidebarItem
          href="/admin/payments"
          icon={<MdOutlinePayments />}
          label="Quản lý thanh toán"
          isOpen={isOpen}
        />
        <SidebarItem
          href="/admin/chat"
          icon={<FiMessageCircle />}
          label="Tư vấn Realtime"
          isOpen={isOpen}
        />
        <SidebarItem
          href="/admin/reports"
          icon={<FiBarChart2 />}
          label="Thống kê & Báo cáo"
          isOpen={isOpen}
        />

        {/* Đăng xuất */}
        <div
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-red-700 text-red-500 hover:text-white transition-all ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={logout}
        >
          <FiLogOut />
          {isOpen && <span className="ml-3">Đăng xuất</span>}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
