"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type Role = "MASTER_ADMIN" | "TUTOR" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  subjects?: string[]; // IDs of subjects they handle (if Tutor)
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users for Demo
export const MOCK_USERS: Record<string, User> = {
  admin: {
    id: "admin-1",
    name: "Master Admin",
    email: "admin@lesvita.com",
    role: "MASTER_ADMIN",
  },
  nisa: {
    id: "tutor-nisa",
    name: "Kak Nisa",
    email: "nisa@lesvita.com",
    role: "TUTOR",
    subjects: ["mat-5"], // Matematika
  },
  willi: {
    id: "tutor-willi",
    name: "Kak Willi",
    email: "willi@lesvita.com",
    role: "TUTOR",
    subjects: ["eng-8"], // Bahasa Inggris
  },
  alif: {
    id: "student-alif",
    name: "Alif (Siswa)",
    email: "alif@siswa.com",
    role: "STUDENT",
    subjects: ["mat-5", "ipa-4", "eng-8"], // Enrolled courses
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("lesvita_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // DO NOTHING if no local session found.
    // We removed the auto-login mock because we are now connected to the real database.

    setIsLoaded(true);
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("lesvita_user", JSON.stringify(newUser));
    router.push("/admin");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lesvita_user");
    router.push("/login");
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
