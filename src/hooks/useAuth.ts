import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/auth/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated };
};
