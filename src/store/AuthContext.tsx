import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DemoProfile } from '../types';

interface AuthContextType {
  profile: DemoProfile | null;
  login: (profile: DemoProfile) => void;
  logout: () => void;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<DemoProfile | null>(() => {
    const saved = localStorage.getItem('demoUser');
    if (saved === 'teacher' || saved === 'student') return saved;
    return null;
  });

  const login = useCallback((p: DemoProfile) => {
    localStorage.setItem('demoUser', p);
    setProfile(p);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('demoUser');
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        login,
        logout,
        isTeacher: profile === 'teacher',
        isStudent: profile === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
