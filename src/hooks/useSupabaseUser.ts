import { useAuth } from './useAuth';

export function useSupabaseUser() {
  const { user } = useAuth();
  return user;
}
