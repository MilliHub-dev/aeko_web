"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { User } from "@/types/user";
import { getProfile } from "@/lib/get-profile";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const retryCountRef = useRef(0);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const profile = await getProfile();
      setUser((prev) => profile ?? prev);
      if (!profile && retryCountRef.current < 3) {
        retryCountRef.current += 1;
        setTimeout(() => {
          void fetchUser();
        }, 2000);
      } else if (profile) {
        retryCountRef.current = 0;
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
