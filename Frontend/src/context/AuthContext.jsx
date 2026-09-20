import { createContext, useEffect, useState } from "react";

import {
  registerUser,
  loginUser,
  getCurrentUser
} from "../services/auth.api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("projectly-token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("projectly-token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const register = async (userData) => {
    const data = await registerUser(userData);

    localStorage.setItem("projectly-token", data.token);

    setUser(data.user);

    return data;
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    localStorage.setItem("projectly-token", data.token);

    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("projectly-token");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
  setUser(updatedUser);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}