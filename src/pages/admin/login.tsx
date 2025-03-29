import { useState } from "react";
import { loginAdmin } from "@/services/authService";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginAdmin(username, password);
      if (res.status === "success") {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/admin/dashboard");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border mt-4 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mt-2 rounded-md"
        />
        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Login;
