'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://worktally-api.vercel.app/api';

// Type definitions for API data structures
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  job_title?: string;
  department?: string;
  phone_number?: string;
  organization?: Organization;
  is_active: boolean;
  date_joined: string;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface TimeEntry {
  id: number;
  user: number;
  project: number | { id: number; name: string; };
  description: string;
  start_time: string;
  end_time?: string;
  clock_in: string;
  clock_out?: string;
  duration?: number;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  organization: number;
  is_active: boolean;
  created_at: string;
}

export interface TimeOffRequest {
  id: number;
  user: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Generic API request function
export async function apiRequest(endpoint: string, options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
} = {}) {
  const { method = 'GET', body, headers = {} } = options;
  
  // Get auth token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token && { Authorization: `Token ${token}` }),
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth functions
export async function login(email: string, password: string) {
  return apiRequest('/users/login/', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_id?: number;
}) {
  return apiRequest('/users/register/', {
    method: 'POST',
    body: userData,
  });
}

export async function logout() {
  try {
    await apiRequest('/users/logout/', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API response
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}

// User functions
export async function getCurrentUser(): Promise<User> {
  return apiRequest('/users/me/');
}

export async function updateUser(userData: Partial<User>): Promise<User> {
  return apiRequest('/users/me/', {
    method: 'PATCH',
    body: userData,
  });
}

// Time entry functions
export async function getTimeEntries(filters?: {
  date?: string;
  project?: number;
  user?: number;
}): Promise<TimeEntry[]> {
  const queryParams = new URLSearchParams();
  if (filters?.date) queryParams.append('date', filters.date);
  if (filters?.project) queryParams.append('project', filters.project.toString());
  if (filters?.user) queryParams.append('user', filters.user.toString());
  
  const endpoint = `/timekeeping/time-entries/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return apiRequest(endpoint);
}

export async function createTimeEntry(entryData: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<TimeEntry> {
  return apiRequest('/timekeeping/time-entries/', {
    method: 'POST',
    body: entryData,
  });
}

export async function updateTimeEntry(id: number, entryData: Partial<TimeEntry>): Promise<TimeEntry> {
  return apiRequest(`/timekeeping/time-entries/${id}/`, {
    method: 'PATCH',
    body: entryData,
  });
}

export async function deleteTimeEntry(id: number): Promise<void> {
  return apiRequest(`/timekeeping/time-entries/${id}/`, {
    method: 'DELETE',
  });
}

// Project functions
export async function getProjects(): Promise<Project[]> {
  return apiRequest('/timekeeping/projects/');
}

export async function createProject(projectData: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
  return apiRequest('/timekeeping/projects/', {
    method: 'POST',
    body: projectData,
  });
}

// Organization functions
export async function getOrganizations(): Promise<Organization[]> {
  return apiRequest('/users/organizations/');
}

export async function createOrganization(orgData: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> {
  return apiRequest('/users/organizations/', {
    method: 'POST',
    body: orgData,
  });
}

// Time off functions
export async function getTimeOffRequests(): Promise<TimeOffRequest[]> {
  return apiRequest('/timekeeping/time-off/');
}

export async function createTimeOffRequest(requestData: Omit<TimeOffRequest, 'id' | 'created_at' | 'status'>): Promise<TimeOffRequest> {
  return apiRequest('/timekeeping/time-off/', {
    method: 'POST',
    body: requestData,
  });
}

// Utility functions
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toTimeString().split(' ')[0].slice(0, 5);
}

export function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.floor((end.getTime() - start.getTime()) / 60000); // Duration in minutes
}
