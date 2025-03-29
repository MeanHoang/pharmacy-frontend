import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </div>
  );
};

export default Dashboard;
