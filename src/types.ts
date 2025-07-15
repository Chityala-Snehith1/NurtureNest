export interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'pregnancy' | 'postpartum' | 'nutrition' | 'mental-health';
  image_url: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  subtopic: string;
  likes: number;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export interface InPersonAppointment {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  appointmentDateTime: string;
  notes?: string;
  userId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
  replies?: Comment[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

// Oracle-specific authentication types
export interface OracleAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface OracleUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

// Database service authentication types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
}

export interface AuthResponse {
  user: AuthUser;
  session: AuthSession;
}