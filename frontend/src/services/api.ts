const API_BASE_URL = 'http://localhost:3000/api/v0';

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(email: string, code: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async requestPasswordReset(email: string) {
    return this.request('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });
  }

  // Locker methods
  async getAllLockers() {
    return this.request<any[]>('/lockers/');
  }

  async getAvailableLockers() {
    return this.request<any[]>('/lockers/available');
  }

  async getLocker(id: string) {
    return this.request<any>(`/lockers/${id}`);
  }

  async createLocker(lockerData: any) {
    return this.request<any>('/lockers/', {
      method: 'POST',
      body: JSON.stringify(lockerData),
    });
  }

  async updateLocker(id: string, lockerData: any) {
    return this.request<any>(`/lockers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lockerData),
    });
  }

  async deleteLocker(id: string) {
    return this.request(`/lockers/${id}`, {
      method: 'DELETE',
    });
  }

  async updateLockerStatus(id: string, status: string) {
    return this.request(`/lockers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Reservation methods
  async getUserReservations() {
    return this.request<any[]>('/reservations/user');
  }

  async createReservation(lockerId: string, duration: number) {
    console.log('API: Creating reservation with:', { lockerId, duration });
    return this.request<any>('/reservations/', {
      method: 'POST',
      body: JSON.stringify({ lockerId, duration }),
    });
  }

  async cancelReservation(id: string) {
    return this.request(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllReservations() {
    return this.request<any[]>('/reservations/');
  }

  async getReservation(id: string) {
    return this.request<any>(`/reservations/${id}`);
  }

  // User methods
  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }
}

export const apiService = new ApiService();