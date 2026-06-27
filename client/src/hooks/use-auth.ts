import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const AUTH_STORAGE_KEY = "ceres-auth-session";
const LOCAL_USERS_STORAGE_KEY = "ceres-local-users";

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  source: "local" | "server";
}

interface LocalUserRecord {
  id: number;
  email: string;
  password: string;
  name: string;
}

function readStorageValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function writeStorageValue(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

export function readStoredAuthSession(): AuthUser | null {
  const stored = readStorageValue(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function writeStoredAuthSession(user: AuthUser) {
  writeStorageValue(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function readLocalUsers(): LocalUserRecord[] {
  const stored = readStorageValue(LOCAL_USERS_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as LocalUserRecord[];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: LocalUserRecord[]) {
  writeStorageValue(LOCAL_USERS_STORAGE_KEY, JSON.stringify(users));
}

export function authenticateLocally({
  email,
  password,
  name,
  createIfMissing = false,
}: {
  email: string;
  password: string;
  name?: string;
  createIfMissing?: boolean;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readLocalUsers();
  const existing = users.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (createIfMissing) {
    if (existing) {
      return existing.password === password
        ? {
            userId: existing.id,
            email: existing.email,
            name: existing.name,
            source: "local" as const,
          }
        : null;
    }

    const newUser = {
      id: Date.now(),
      email: normalizedEmail,
      password,
      name: name?.trim() || normalizedEmail.split("@")[0],
    };
    writeLocalUsers([...users, newUser]);
    return {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      source: "local" as const,
    };
  }

  if (!existing || existing.password !== password) return null;

  return {
    userId: existing.id,
    email: existing.email,
    name: existing.name,
    source: "local" as const,
  };
}

export function useAuthStatus() {
  return useQuery({
    queryKey: ["/auth/status"],
    queryFn: async () => {
      const localSession = readStoredAuthSession();

      try {
        const res = await fetch("/api/auth/status");
        if (res.ok) {
          const payload = await res.json();
          if (payload?.email) {
            const session = {
              userId: payload.userId ?? Date.now(),
              email: payload.email,
              name: payload.name || payload.email.split("@")[0],
              source: "server" as const,
            };
            writeStoredAuthSession(session);
            return session;
          }
        }
      } catch {
        // Keeps local fallback active when the API is unavailable.
      }

      return localSession;
    },
    retry: false,
    staleTime: 1000 * 30,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Ignore network errors and continue with local logout.
      }
      clearStoredAuthSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/auth/status"] });
      window.location.href = "/login";
    },
  });
}
