export interface User {
  id: string;
  email: string;
  name: string;  // Required name field
  role: 'admin' | 'student';
  categories: string[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  file_url: string;
  category_id: string;
  uploaded_at: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}