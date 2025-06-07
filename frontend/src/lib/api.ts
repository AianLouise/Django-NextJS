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
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  max_users: number;
  address?: string;
  phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  client?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_time?: number;
  total_time_formatted?: string;
}

export interface TimeEntry {
  id: number;
  user: number;
  clock_in: string;
  clock_out?: string;
  notes?: string;
  project?: Project;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  duration?: number;
  duration_formatted?: string;
}

export interface TimeOffRequest {
  id: number;
  user: number;
  start_date: string;
  end_date: string;
  request_type: 'vacation' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  reviewed_by?: number;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

interface ClockData {
  project_id?: number;
  notes?: string;
}

interface UserProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  job_title?: string;
  department?: string;
  phone_number?: string;
}

interface TimeEntryCreateData {
  clock_in: string;
  clock_out?: string;
  notes?: string;
  project?: number;
}

interface TimeEntryUpdateData {
  clock_in?: string;
  clock_out?: string;
  notes?: string;
  project?: number;
}

interface TimeOffCreateData {
  start_date: string;
  end_date: string;
  request_type: 'vacation' | 'sick' | 'personal' | 'other';
  reason?: string;
}

// Type for api options
interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  token?: string;
  isFormData?: boolean;
}

/**
 * Helper function to make API calls with proper authentication
 * @param endpoint API endpoint path (without base URL)
 * @param options Request options
 * @returns Promise with response data
 */
export async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const {
    method = 'GET',
    body,
    token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null,
    isFormData = false,
  } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
  };
  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  // Handle errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });

    // Create a more descriptive error message
    const errorMessage = errorData.detail ||
      Object.values(errorData).flat().join(', ') ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  // Return JSON response or null for 204 No Content
  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

/**
 * Helper function for logout
 */
export async function logout() {
  try {
    // Get token for the API call
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // Call logout API if we have a token
    if (token) {
      await apiRequest('/users/logout/', {
        method: 'POST',
        token
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear all auth data regardless of API response
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }

    // Clear the cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Clear the dashboard loaded flag to ensure welcome message shows on next login
    sessionStorage.removeItem('dashboard_loaded');

    // Clear any other session data if needed
    // sessionStorage.clear(); // Uncomment if you want to clear all session storage
  }
}

// ===== Timekeeping API Functions =====

/**
 * Get timesheet entries for a date range
 */
export async function getTimeEntries(startDate: string, endDate: string) {
  return apiRequest(`/timekeeping/time-entries/?start_date=${startDate}&end_date=${endDate}`);
}

/**
 * Get a specific time entry
 */
export async function getTimeEntry(entryId: number) {
  return apiRequest(`/timekeeping/time-entries/${entryId}/`);
}

/**
 * Create a new time entry
 */
export async function createTimeEntry(data: TimeEntryCreateData) {
  return apiRequest('/timekeeping/time-entries/', {
    method: 'POST',
    body: data
  });
}

/**
 * Update a time entry
 */
export async function updateTimeEntry(entryId: number, data: TimeEntryUpdateData) {
  return apiRequest(`/timekeeping/time-entries/${entryId}/`, {
    method: 'PUT',
    body: data
  });
}

/**
 * Delete a time entry
 */
export async function deleteTimeEntry(entryId: number) {
  return apiRequest(`/timekeeping/time-entries/${entryId}/`, {
    method: 'DELETE'
  });
}

/**
 * Clock in a user
 */
export async function clockIn(data: ClockData = {}) {
  return apiRequest('/timekeeping/clock-in/', {
    method: 'POST',
    body: data
  });
}

/**
 * Clock out a user
 */
export async function clockOut(data: ClockData = {}) {
  return apiRequest('/timekeeping/clock-out/', {
    method: 'POST',
    body: data
  });
}

/**
 * Get dashboard data
 */
export async function getDashboardData() {
  return apiRequest('/timekeeping/dashboard/');
}

/**
 * Get all projects
 */
export async function getProjects(activeOnly: boolean = true) {
  return apiRequest(`/timekeeping/projects/?active_only=${activeOnly}`);
}

// ===== User Management API Functions =====

/**
 * Get the current user's details
 */
export async function getCurrentUser() {
  return apiRequest('/users/me/');
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: UserProfileUpdateData) {
  return apiRequest('/users/update-profile/', {
    method: 'PUT',
    body: data
  });
}

/**
 * Change user password
 */
export async function changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
  return apiRequest('/users/change-password/', {
    method: 'POST',
    body: {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    }
  });
}

/**
 * Get team members
 */
export async function getTeamMembers() {
  return apiRequest('/users/team/');
}

/**
 * Request time off
 */
export async function requestTimeOff(data: TimeOffCreateData) {
  return apiRequest('/timekeeping/time-off/', {
    method: 'POST',
    body: data
  });
}

/**
 * Get time off requests
 */
export async function getTimeOffRequests() {
  return apiRequest('/timekeeping/time-off/');
}

/**
 * Review a time off request (approve/reject)
 */
export async function reviewTimeOffRequest(requestId: number, status: 'approved' | 'rejected', notes: string = '') {
  return apiRequest(`/timekeeping/time-off/${requestId}/review/`, {
    method: 'POST',
    body: {
      status,
      review_notes: notes
    }
  });
}
