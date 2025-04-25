import React, { createContext, useContext, useEffect } from 'react';

enum Gender {
  male = 'male',
  female = 'female',
}

type AuthUserType = {
  id: string;
  username: string;
  fullName: string;
  profilePic: string;
  gender: Gender;
};

type AuthContextType = {
  authUser: AuthUserType | null;
  handleSetAuthUser: (user: AuthUserType | null) => void;
  isLoading: boolean;
};

const AuthCotext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = React.useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const handleSetAuthUser = (user: AuthUserType | null) => {
    setAuthUser(user);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        handleSetAuthUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return <AuthCotext.Provider value={{ authUser, handleSetAuthUser, isLoading }}>{children}</AuthCotext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthCotext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
}
