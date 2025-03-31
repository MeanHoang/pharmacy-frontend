export interface Store {
  id: number;
  username: string;
  password: string;
  name: string;
  phonenumber: string;
  address?: string;
  city: string;
  district: string;
  ward: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
