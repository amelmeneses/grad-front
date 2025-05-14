import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

export function getUserRole(): number | null {
  const token = getToken();
  if (!token) return null;
  try {
    const { role } = jwtDecode<{ role: number }>(token);
    return role;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
