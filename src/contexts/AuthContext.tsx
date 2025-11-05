import React, { createContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  preferredLanguage?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updatePreferredLanguage: (language: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'agrishield_users';
const CURRENT_USER_KEY = 'agrishield_current_user';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  preferredLanguage?: string;
  createdAt: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUserJson) {
      try {
        const currentUser: User = JSON.parse(currentUserJson);
        setUser(currentUser);
      } catch (error) {
        console.error('Error parsing current user:', error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getAllUsers = (): StoredUser[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersJson) return [];
    try {
      return JSON.parse(usersJson);
    } catch (error) {
      console.error('Error parsing users:', error);
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const users = getAllUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, message: 'No account found with this email' };
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Incorrect password' };
    }

    const userWithoutPassword: User = {
      id: foundUser.id,
      email: foundUser.email,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      profileImageUrl: foundUser.profileImageUrl,
      preferredLanguage: foundUser.preferredLanguage,
      createdAt: foundUser.createdAt,
    };

    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const updatePreferredLanguage = (language: string) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const updatedUser = { ...prevUser, preferredLanguage: language };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      const users = getAllUsers();
      const userIndex = users.findIndex((u) => u.id === prevUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], preferredLanguage: language };
        saveUsers(users);
      }

      return updatedUser;
    });
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; message?: string }> => {
    const users = getAllUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const userWithoutPassword: User = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      profileImageUrl: newUser.profileImageUrl,
      preferredLanguage: newUser.preferredLanguage,
      createdAt: newUser.createdAt,
    };

    setUser(userWithoutPassword);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updatePreferredLanguage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
