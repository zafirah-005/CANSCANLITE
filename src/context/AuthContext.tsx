import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  email: string;
  name: string;
  age: string;
  area: string;
  medications?: string;
  allergies?: string;
  emergencyContacts?: string;
  homeLocation?: { lat: number; lng: number; address: string };
  theme?: 'light' | 'dark';
  fontSize?: 'small' | 'medium' | 'large';
  medicalHistory?: Array<{
    date: string;
    condition: string;
    treatment: string;
    doctor: string;
  }>;
  symptoms?: Array<{
    date: string;
    symptoms: string[];
    severity: number;
  }>;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('canScanUserProfile');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user profile:', error);
        localStorage.removeItem('canScanUserProfile');
      }
    }
  }, []);

  const login = (profile: UserProfile) => {
    localStorage.setItem('canScanUserProfile', JSON.stringify(profile));
    setUser(profile);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('canScanUserProfile', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('canScanUserProfile');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};