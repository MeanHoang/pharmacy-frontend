import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const loginAdmin = async (username: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
    username,
    password,
  });
  // console.log(">>Check res.data: ", res.data);
  return res.data;
};
