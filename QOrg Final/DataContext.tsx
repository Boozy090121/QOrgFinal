"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/useAuth';
import { 
  getRoles, 
  getPersonnel, 
  getFactories, 
  getTimeline,
  getScenarios,
  getUserPreferences
} from '@/firestore';
import { Role, Personnel, Factory } from '@/types';

// Define the shape of our context
interface DataContextType {
  roles: Role[];
  personnel: Personnel[];
  factories: Factory[];
  timeline: any[];
  scenarios: any[];
  preferences: any;
  loading: boolean;
  error: string | null;
  refetchData: () => void;
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    // Explicitly check if user is authenticated before fetching
    if (!user) {
      // console.log("DataContext: No user found, skipping fetch."); // Optional: for debugging
      setLoading(false); // Set loading to false as we are not fetching
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data concurrently
      const [fetchedRoles, fetchedPersonnel, fetchedFactories] = await Promise.all([
        getRoles(),
        getPersonnel(),
        getFactories()
      ]);
      setRoles(fetchedRoles || []);
      setPersonnel(fetchedPersonnel || []);
      setFactories(fetchedFactories || []);
    } catch (err: any) {
      console.error("Error fetching global data:", err);
      setError(err.message || 'Failed to load application data');
      // Clear data on error?
      setRoles([]);
      setPersonnel([]);
      setFactories([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when the component mounts or when the user changes
  useEffect(() => {
    fetchData();
  }, [user]);
  
  // The value that will be provided to consumers of this context
  const value = {
    roles,
    personnel,
    factories,
    timeline,
    scenarios,
    preferences,
    loading,
    error,
    refetchData: fetchData
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
