// ============================================================
// Mchanga Afya — Centralized API Client
// All backend calls go through here. Never use relative paths.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error(
    '[Mchanga Afya] VITE_API_URL is not set. ' +
    'API calls will fail. Check Vercel environment variables.'
  );
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const url = `${BASE_URL}${path}`;  // ✅ Always hits Render

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ── Typed API helpers per domain ──────────────────────────────

export const farmersApi = {
  getAll: ()            => apiRequest('/api/farmers'),
  getById: (id: string) => apiRequest(`/api/farmers/${id}`),
  create: (data: unknown) =>
    apiRequest('/api/farmers', { method: 'POST', body: data }),
  update: (id: string, data: unknown) =>
    apiRequest(`/api/farmers/${id}`, { method: 'PUT', body: data }),
};

export const soilApi = {
  getReadings: (farmerId: string) =>
    apiRequest(`/api/soil/${farmerId}`),
  submitReading: (data: unknown) =>
    apiRequest('/api/soil', { method: 'POST', body: data }),
};

export const fertiliserApi = {
  getApplications: (farmerId: string) =>
    apiRequest(`/api/fertiliser/${farmerId}`),
  logApplication: (data: unknown) =>
    apiRequest('/api/fertiliser', { method: 'POST', body: data }),
};

export const cropApi = {
  getCycles: (farmerId: string) =>
    apiRequest(`/api/crops/${farmerId}`),
  createCycle: (data: unknown) =>
    apiRequest('/api/crops', { method: 'POST', body: data }),
};

export const yieldApi = {
  getOutcomes: (farmerId: string) =>
    apiRequest(`/api/yield/${farmerId}`),
};

export const recommendationsApi = {
  get: (farmerId: string) =>
    apiRequest(`/api/recommendations/${farmerId}`),
};