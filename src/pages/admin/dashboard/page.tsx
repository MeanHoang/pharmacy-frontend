import AdminSidebar from "@/components/admin/Sidebar/Siderbar";

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </main>
    </div>
  );
};

export default Dashboard;
