/*
 * @(#)AuthContext.tsx
 *
 * Copyright 2025, Purmind - Purfine Group
 * http://www.purmind.com.br
 *
 * Todos os direitos reservados.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextData = {
  user: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // apenas para desenvolvimento
      await SecureStore.deleteItemAsync('user'); 
    
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    }
    
    loadUser();
  }, []);

  async function signIn(email: string, password: string) {
    // Aqui você implementaria a lógica de autenticação real
    await SecureStore.setItemAsync('user', email);
    setUser(email);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  }

  async function signUp(email: string, password: string) {
    // Lógica de registro
    await SecureStore.setItemAsync('user', email);
    setUser(email);
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}