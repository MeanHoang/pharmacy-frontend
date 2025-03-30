import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginAdmin } from "@/services/auth/authService";

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const res = await loginAdmin(username, password);
      if (res.status === "success") {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/admin/dashboard/page");
      } else {
        toast.error(res.message, { position: "top-right" });
      }
    } catch (err) {
      toast.error("Đăng nhập thất bại!", { position: "top-right" });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br to-indigo-600 p-4">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center">
          <span className="text-blue-600 text-16px font-bold">admin</span>
          <span className="text-yellow-500 text-4xl font-extrabold">Login</span>
        </h2>

        <div className="relative mt-6">
          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tên tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
          />
        </div>

        <div className="relative mt-4">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Login;
