import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

interface AuthContextType {
  user: GoogleUser | null;
  loginWithCredential: (credential: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT credential:', e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(null);

  // Load persisted user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('noir_google_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Error restoring Google session:', e);
    }
  }, []);

  const loginWithCredential = (credential: string): boolean => {
    try {
      const payload = parseJwt(credential);
      if (payload && payload.email) {
        const newUser: GoogleUser = {
          sub: payload.sub,
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          picture: payload.picture || '',
          given_name: payload.given_name,
          family_name: payload.family_name,
        };
        setUser(newUser);
        localStorage.setItem('noir_google_user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error with credential:', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noir_google_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithCredential,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
