export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'client';
  is_email_verified: boolean;
  email_verification_token?: string;
  email_verification_token_expires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Locker {
  _id: string;
  number: number;
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'reserved' | 'maintenance';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  user: string | User;
  locker: string | Locker;
  startDate: string;
  endDate: string;
  duration: number;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired';
  paymentId?: string;
  emailSent: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role?: 'admin' | 'client';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
