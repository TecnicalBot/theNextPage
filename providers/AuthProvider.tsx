import {
  useContext,
  createContext,
  type PropsWithChildren,
  useMemo,
  useEffect,
} from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext<{
  signIn: (sessionData: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// Hook to access authentication state
export function useSession() {
  return useContext(AuthContext);
}

// Provider for managing authentication
export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  // Check for expired session on mount
  useEffect(() => {
    if (session) {
      const { expiresAt } = JSON.parse(session);
      if (Date.now() > expiresAt) {
        setSession(null);
      }
    }
  }, [session]);

  const authValue = useMemo(
    () => ({
      signIn: (sessionData: string) => {
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        setSession(JSON.stringify({ sessionData, expiresAt }));
      },
      signOut: () => setSession(null),
      session: session ? JSON.parse(session).sessionData : null,
      isLoading,
    }),
    [session, isLoading]
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}
