"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthChange } from '@/auth';
import { User } from '@/types';

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isReadOnly: boolean;
  toggleReadOnly: () => void;
  isAdmin: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isReadOnly: false,
  toggleReadOnly: () => {},
  isAdmin: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  
  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // Function to toggle read-only state
  const toggleReadOnly = () => {
    setIsReadOnly(prev => !prev);
  };

  // Determine admin status directly from user object
  const isAdmin = user?.isAdmin || false;

  // The value that will be provided to consumers of this context
  const value = {
    user,
    loading,
    error,
    isReadOnly,
    toggleReadOnly,
    isAdmin,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
