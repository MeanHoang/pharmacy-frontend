export interface Customer {
  id: number;
  email: string;
  password: string;
  phonenumber: string;
  fullname: string;
  google_id?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  birthday?: Date;
  is_verified?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
