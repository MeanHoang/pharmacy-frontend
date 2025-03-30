export interface Admin {
  id: number;
  username: string;
  fullname?: string;
  password: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
