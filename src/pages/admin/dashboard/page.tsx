import AdminSidebar from "@/components/admin/Sidebar/Siderbar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">Trang chủ</h1>
      </div>
    </div>
  );
};

export default Dashboard;
