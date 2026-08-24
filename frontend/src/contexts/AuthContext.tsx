import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;

  signUp: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;

  signIn: (
    email: string,
    password: string
  ) => Promise<void>;

  signInWithGoogle: () => Promise<void>;

  signOut: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // LOAD SESSION
  // =========================================

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }

    void loadSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, nextSession) => {
          setSession(nextSession);
          setUser(
            nextSession?.user ?? null
          );
          setLoading(false);
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================================
  // EMAIL SIGN UP
  // =========================================

  async function signUp(
    fullName: string,
    email: string,
    password: string
  ) {
    const { error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          emailRedirectTo:
            `${window.location.origin}/auth/confirmed`,

          data: {
            full_name:
              fullName.trim(),
          },
        },
      });

    if (error) {
      throw error;
    }
  }

  // =========================================
  // EMAIL SIGN IN
  // =========================================

  async function signIn(
    email: string,
    password: string
  ) {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }
  }

  // =========================================
  // GOOGLE SIGN IN
  // =========================================

  async function signInWithGoogle() {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo:
            `${window.location.origin}/`,
        },
      });

    if (error) {
      throw error;
    }
  }

  // =========================================
  // SIGN OUT
  // =========================================

  async function signOut() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}