import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  id: number;
  correo: string;
  nombre: string;
}

interface ErrorResponse {
  detail: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const API_URL = 'http://localhost:8000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Configurar el interceptor de axios para incluir el token en todas las peticiones
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/usuarios/me`);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post(
        `${API_URL}/api/usuarios/token`,
        {
          correo: email,
          contraseña: password,
        }
      );

      console.log('Login response:', response.data);
      const { access_token: accessToken, user: userData } = response.data;
      
      if (!accessToken || !userData) {
        throw new Error('Respuesta del servidor inválida');
      }

      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data?.detail) {
          throw new Error(axiosError.response.data.detail);
        } else if (axiosError.response) {
          throw new Error('Error en el servidor');
        } else if (axiosError.request) {
          throw new Error('No se pudo conectar con el servidor');
        }
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 