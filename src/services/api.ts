import type { ApiResponse, Book, Category, LoginResponse, User } from '@/types';

// Set this to your deployed Google Apps Script Web App URL
const API_BASE = 'https://script.google.com/macros/s/AKfycbyQaLNEvq0NCw3SLY05DdioB625_RORCshDmtIDwHEl8DruL6jpFbhV35MRIrt9tM8jiA/exec';

async function request<T>(action: string, params: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    return { success: false, error: 'API URL not configured. Go to Settings to set it.' };
  }

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, ...params }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: 'Network error. Check your connection.' };
  }
}

export const api = {

  // Auth
  login(email: string, pin: string) {
    return request<{ user: User }>('login', { email, pin });
  },

  // Users
  createUser(email: string, categories: string[], name: string) { // name is now required
    return request<{ user: User; pin: string }>('createUser', { email, categories, name });
  },

  getUsers() {
    return request<{ users: User[] }>('getUsers');
  },

  assignCategory(userId: string, categories: string[]) {
    return request<{ user: User }>('assignCategory', { userId, categories });
  },

  regeneratePin(userId: string) {
    return request<{ pin: string }>('regeneratePin', { userId });
  },

  deleteUser(userId: string) {
    return request<void>('deleteUser', { userId });
  },

  // Categories
  createCategory(name: string, description: string) {
    return request<{ category: Category }>('createCategory', { name, description });
  },

  getCategories() {
    return request<{ categories: Category[] }>('getCategories');
  },

  deleteCategory(categoryId: string) {
    return request<void>('deleteCategory', { categoryId });
  },

  // Books
  addBook(title: string, fileUrl: string, categoryId: string) {
    return request<{ book: Book }>('addBook', { title, fileUrl, categoryId });
  },

  getBooksByCategory(categoryId: string) {
    return request<{ books: Book[] }>('getBooksByCategory', { categoryId });
  },

  getAllBooks() {
    return request<{ books: Book[] }>('getAllBooks');
  },

  deleteBook(bookId: string) {
    return request<void>('deleteBook', { bookId });
  },
};