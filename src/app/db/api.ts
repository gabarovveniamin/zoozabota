// Client-side API module — replaces Dexie for data access
// All functions call Vercel Serverless Functions which talk to Neon PostgreSQL

import type { Pet, PetRequest, Service, ServiceRequest, DocumentItem } from './types';

// Re-export types for backward compatibility
export type { Pet, PetRequest, Service, ServiceRequest, DocumentItem };
export { DEFAULT_SERVICES, DEFAULT_DOCUMENTS, MOCK_PDF } from './types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }
  return res.json();
}

// ===== PETS =====
export const petsApi = {
  getAll: (): Promise<Pet[]> =>
    request<Pet[]>('/pets'),

  add: (pet: Omit<Pet, 'id'>): Promise<Pet> =>
    request<Pet>('/pets', {
      method: 'POST',
      body: JSON.stringify(pet),
    }),

  delete: (id: number): Promise<void> =>
    request<void>(`/pets?id=${id}`, { method: 'DELETE' }),
};

// ===== PET REQUESTS =====
export const petRequestsApi = {
  getAll: (): Promise<PetRequest[]> =>
    request<PetRequest[]>('/pet-requests'),

  get: (id: number): Promise<PetRequest | null> =>
    request<PetRequest | null>(`/pet-requests?id=${id}`),

  add: (petRequest: Omit<PetRequest, 'id'>): Promise<PetRequest> =>
    request<PetRequest>('/pet-requests', {
      method: 'POST',
      body: JSON.stringify(petRequest),
    }),

  update: (id: number, data: Partial<PetRequest>): Promise<void> =>
    request<void>('/pet-requests', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    }),
};

// ===== SERVICES =====
export const servicesApi = {
  getAll: (): Promise<Service[]> =>
    request<Service[]>('/services'),

  add: (service: Omit<Service, 'id'>): Promise<Service> =>
    request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),

  update: (id: number, data: Partial<Service>): Promise<void> =>
    request<void>('/services', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    }),

  delete: (id: number): Promise<void> =>
    request<void>(`/services?id=${id}`, { method: 'DELETE' }),
};

// ===== SERVICE REQUESTS =====
export const serviceRequestsApi = {
  getAll: (): Promise<ServiceRequest[]> =>
    request<ServiceRequest[]>('/service-requests'),

  add: (serviceRequest: Omit<ServiceRequest, 'id'>): Promise<ServiceRequest> =>
    request<ServiceRequest>('/service-requests', {
      method: 'POST',
      body: JSON.stringify(serviceRequest),
    }),

  update: (id: number, data: Partial<ServiceRequest>): Promise<void> =>
    request<void>('/service-requests', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    }),
};

// ===== DOCUMENTS =====
export const documentsApi = {
  getAll: (): Promise<DocumentItem[]> =>
    request<DocumentItem[]>('/documents'),

  add: (doc: Omit<DocumentItem, 'id'>): Promise<DocumentItem> =>
    request<DocumentItem>('/documents', {
      method: 'POST',
      body: JSON.stringify(doc),
    }),

  update: (id: number, data: Partial<DocumentItem>): Promise<void> =>
    request<void>('/documents', {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    }),

  delete: (id: number): Promise<void> =>
    request<void>(`/documents?id=${id}`, { method: 'DELETE' }),
};

// ===== SEARCH =====
export const searchApi = {
  searchPets: (query: string): Promise<Pet[]> =>
    request<Pet[]>(`/search-pets?q=${encodeURIComponent(query)}`),
  searchServices: (query: string): Promise<Service[]> =>
    request<Service[]>(`/search-services?q=${encodeURIComponent(query)}`),
};

// ===== ADMIN AUTH =====
export const adminApi = {
  login: (password: string): Promise<{ success: boolean; error?: string }> =>
    request<{ success: boolean; error?: string }>('/admin-auth', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// ===== SETTINGS =====
export const settingsApi = {
  get: (): Promise<Record<string, string>> =>
    request<Record<string, string>>('/settings'),

  update: (settings: Record<string, string>): Promise<Record<string, string>> =>
    request<Record<string, string>>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// ===== USER AUTH =====
export const authApi = {
  register: (user: { firstName: string; lastName: string; phone: string; password: string }): Promise<{ firstName: string; lastName: string; phone: string }> =>
    request<{ firstName: string; lastName: string; phone: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  login: (credentials: { phone: string; password: string }): Promise<{ firstName: string; lastName: string; phone: string }> =>
    request<{ firstName: string; lastName: string; phone: string }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};
