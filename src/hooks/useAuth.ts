import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthContext {
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuth = (): AuthContext => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login/page");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    router.push("/admin/login/page");
  };

  return { isAuthenticated, logout };
};
