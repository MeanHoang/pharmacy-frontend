export interface Order {
  id: number;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  recipient_name: string;
  phone_number: string;
  address?: string;
  city: string;
  district: string;
  ward: string;
  created_at: string;
}
