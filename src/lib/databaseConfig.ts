// Database configuration
// This file manages database type selection and configuration

export const DATABASE_TYPES = {
  SUPABASE: 'supabase',
  ORACLE: 'oracle'
} as const;

export type DatabaseType = typeof DATABASE_TYPES[keyof typeof DATABASE_TYPES];

export interface DatabaseConfig {
  type: DatabaseType;
  supabase?: {
    url: string;
    anonKey: string;
  };
  oracle?: {
    backendUrl: string;
  };
}

export function getDatabaseConfig(): DatabaseConfig {
  const type = (import.meta.env.VITE_DATABASE_TYPE || 'supabase') as DatabaseType;
  
  const config: DatabaseConfig = {
    type,
  };

  if (type === DATABASE_TYPES.SUPABASE) {
    config.supabase = {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    };
  } else if (type === DATABASE_TYPES.ORACLE) {
    config.oracle = {
      backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    };
  }

  return config;
}

export function isSupabaseEnabled(): boolean {
  return getDatabaseConfig().type === DATABASE_TYPES.SUPABASE;
}

export function isOracleEnabled(): boolean {
  return getDatabaseConfig().type === DATABASE_TYPES.ORACLE;
}

export function validateDatabaseConfig(): { valid: boolean; errors: string[] } {
  const config = getDatabaseConfig();
  const errors: string[] = [];

  if (config.type === DATABASE_TYPES.SUPABASE) {
    if (!config.supabase?.url) {
      errors.push('VITE_SUPABASE_URL is required for Supabase configuration');
    }
    if (!config.supabase?.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is required for Supabase configuration');
    }
  } else if (config.type === DATABASE_TYPES.ORACLE) {
    if (!config.oracle?.backendUrl) {
      errors.push('VITE_BACKEND_URL is required for Oracle configuration');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
