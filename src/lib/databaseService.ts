// Database service abstraction layer
// This service provides a unified interface for both Supabase and Oracle backends

interface DatabaseService {
  // Auth methods
  signUp(email: string, password: string, userData: any): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;
  getUser(): Promise<any>;
  
  // Data methods
  getAppointments(): Promise<any[]>;
  createAppointment(appointment: any): Promise<any>;
  getArticles(): Promise<any[]>;
  getForumPosts(): Promise<any[]>;
  createForumPost(post: any): Promise<any>;
}

class SupabaseService implements DatabaseService {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getAppointments() {
    const { data, error } = await this.supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createAppointment(appointment: any) {
    const { data, error } = await this.supabase
      .from('appointments')
      .insert([appointment]);
    
    if (error) throw error;
    return data;
  }

  async getArticles() {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getForumPosts() {
    const { data, error } = await this.supabase
      .from('forum_posts')
      .select('*, users(first_name, last_name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createForumPost(post: any) {
    const { data, error } = await this.supabase
      .from('forum_posts')
      .insert([post]);
    
    if (error) throw error;
    return data;
  }
}

class OracleService implements DatabaseService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('oracle_token');
  }

  private async apiCall(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  async signUp(email: string, password: string, userData: any) {
    const response = await this.apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone
      })
    });

    return response;
  }

  async signIn(email: string, password: string) {
    const response = await this.apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    this.token = response.token;
    localStorage.setItem('oracle_token', response.token);
    
    return {
      user: response.user,
      session: { access_token: response.token }
    };
  }

  async signOut() {
    this.token = null;
    localStorage.removeItem('oracle_token');
  }

  async getUser() {
    if (!this.token) return null;
    
    const response = await this.apiCall('/api/user/profile');
    return response;
  }

  async getAppointments() {
    return await this.apiCall('/api/appointments');
  }

  async createAppointment(appointment: any) {
    return await this.apiCall('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment)
    });
  }

  async getArticles() {
    return await this.apiCall('/api/articles');
  }

  async getForumPosts() {
    return await this.apiCall('/api/forum/posts');
  }

  async createForumPost(post: any) {
    return await this.apiCall('/api/forum/posts', {
      method: 'POST',
      body: JSON.stringify(post)
    });
  }
}

// Factory function to create the appropriate service
export function createDatabaseService(): DatabaseService {
  const databaseType = import.meta.env.VITE_DATABASE_TYPE || 'supabase';
  
  if (databaseType === 'oracle') {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    return new OracleService(backendUrl);
  } else {
    // Import Supabase client
    import('../lib/supabase').then(({ supabase }) => {
      return new SupabaseService(supabase);
    });
    
    // For now, return a placeholder - this will be properly handled in the implementation
    throw new Error('Supabase service initialization needs to be handled in the component');
  }
}

export type { DatabaseService };
