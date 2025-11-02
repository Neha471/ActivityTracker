import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import api from '../lib/api';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          const mockUser = { id: '1', email: 'demo@example.com', name: 'Demo User' };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      const data:any = response.data;
      const { token, user }:any = data.data;
      await SecureStore.setItemAsync('authToken', token);
      setUser(user);
    
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/register', { firstName, lastName, email, password });
      const data:any = response.data;
      const { token, user }:any = data.data;
      await SecureStore.setItemAsync('authToken', token);
      setUser(user);
    
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);      
      await SecureStore.deleteItemAsync('authToken');
      
      setUser(null);
      
      delete api.defaults.headers.common['Authorization'];
      
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Logout failed', error);
      await SecureStore.deleteItemAsync('authToken');
      setUser(null);
      router.replace('/(auth)/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
