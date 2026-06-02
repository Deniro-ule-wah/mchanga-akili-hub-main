const ADMIN_SESSION_STORAGE_KEY = "mchanga-afya-admin-session";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export interface AdminSession {
  username: string;
  token: string;
  authenticated: true;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const json = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!json) return null;
    const session = JSON.parse(json) as AdminSession;
    return session.authenticated ? session : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminSession();
}

export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session: AdminSession = {
      username,
      token: "admin-token",
      authenticated: true,
    };
    localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}
