import { createContext, useContext, useState, useEffect } from 'react';
import { api, TOKEN_KEY, USER_KEY } from '@/lib/api';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        const data = await api.get('/api/users/me');
        if (!data || !data.isAdmin) {
          throw new Error('Not an admin account or session expired.');
        }

        setUser(data);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      } catch (err) {
        const msg = err?.message || '';
        if (msg === 'Request aborted' || msg === 'canceled' || msg === 'cancelled') {
          return;
        }
        console.error('Session validation failed:', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setLocation('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();

    const handleFocus = () => {
      if (localStorage.getItem(TOKEN_KEY)) {
        validateSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [setLocation]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/api/users/login', { email, password });
      
      if (!data.isAdmin) {
        throw new Error('Not an admin account. Access denied.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      setUser(data);
      setLocation('/admin');
      
      toast({
        title: 'Access Granted',
        description: `Welcome back, ${data.name}.`,
      });
      
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setLocation('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}