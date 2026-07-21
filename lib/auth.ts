"use client";

export const API_BASE_URL = "https://sltwdpp8-3000.inc1.devtunnels.ms";

export type AuthUser = {
  name?: string;
  mobile: string;
};

export type AuthSession = {
  user: AuthUser;
  raw?: unknown;
};

const AUTH_STORAGE_KEY = "sudhveda_auth_session";
export const AUTH_CHANGED_EVENT = "sudhveda-auth-changed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!value) return null;

    const parsed = JSON.parse(value) as AuthSession;
    if (!parsed?.user?.mobile) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function getInitials(user?: AuthUser | null) {
  const source = user?.name || user?.mobile || "User";
  const words = source.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : "Request failed. Please try again.";
    throw new Error(message);
  }

  return data as T;
}

export function findVerificationId(data: unknown): string | null {
  if (!isRecord(data)) return null;

  const directKeys = ["verificationId", "verification_id", "id"];
  for (const key of directKeys) {
    const value = data[key];
    if (typeof value === "string" && value) return value;
  }

  const nestedKeys = ["data", "user", "result"];
  for (const key of nestedKeys) {
    const nestedId = findVerificationId(data[key]);
    if (nestedId) return nestedId;
  }

  return null;
}

export const authApi = {
  createUser(body: { name: string; mobile: string }) {
    return postApi<unknown>("/api/users/create", body);
  },
  verifySignupOtp(body: { verificationId: string; otp: string }) {
    return postApi<unknown>("/api/users/verify-otp", body);
  },
  login(body: { mobile: string }) {
    return postApi<unknown>("/api/users/login", body);
  },
  verifyLoginOtp(body: { verificationId: string; otp: string }) {
    return postApi<unknown>("/api/users/verify-login-otp", body);
  },
};
