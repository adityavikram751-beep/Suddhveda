"use client";

export const API_BASE_URL = "https://suddhvedha-honey-backend.onrender.com";

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



export function extractToken(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, any>;

  if (typeof obj.token === "string" && obj.token) return obj.token;
  if (typeof obj.accessToken === "string" && obj.accessToken) return obj.accessToken;
  if (typeof obj.jwt === "string" && obj.jwt) return obj.jwt;

  if (obj.data && typeof obj.data === "object") {
    const nestedToken = extractToken(obj.data);
    if (nestedToken) return nestedToken;
  }
  if (obj.user && typeof obj.user === "object") {
    const nestedToken = extractToken(obj.user);
    if (nestedToken) return nestedToken;
  }
  if (obj.result && typeof obj.result === "object") {
    const nestedToken = extractToken(obj.result);
    if (nestedToken) return nestedToken;
  }

  return null;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const cookieMatch = document.cookie.match(/(?:^|;\s*)(sudhveda_token|token|accessToken|jwt)=([^;]+)/);
    if (cookieMatch && cookieMatch[2]) return decodeURIComponent(cookieMatch[2]);
  } catch { }

  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem("sudhveda_token");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("accessToken");
  } catch { }

  return null;
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const token = getStoredToken();
  if (!token) return null;

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AuthSession;
      if (parsed?.user?.mobile) return parsed;
    }
  } catch { }

  return null;
}

export function saveSession(session: AuthSession) {
  const { user, raw } = session;
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ user, raw })
  );

  const token = extractToken(raw);
  if (token) {
    try {
      window.localStorage.setItem("sudhveda_token", token);
      window.localStorage.setItem("token", token);
      document.cookie = `sudhveda_token=${encodeURIComponent(token)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.error("Error saving token to cookie/localStorage:", e);
    }
  }

  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearSession() {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem("sudhveda_token");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("accessToken");
    if (typeof document !== "undefined") {
      const names = ["sudhveda_token", "token", "accessToken", "jwt"];
      names.forEach((name) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        if (typeof window !== "undefined") {
          document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
      });
    }
  } catch { }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}

export async function ensureValidSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined") return null;

  const token = getStoredToken();
  if (!token) {
    clearSession();
    return null;
  }

  const storedSession = getStoredSession();
  if (!storedSession) {
    clearSession();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/profile-details`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      clearSession();
      return null;
    }

    return storedSession;
  } catch {
    return storedSession;
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch { }
  clearSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    window.location.href = "/login";
  }
}

// ---------- Helpers ----------
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
    credentials: "include",
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