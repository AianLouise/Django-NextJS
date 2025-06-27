// User-related types and interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  user: User;
  avatar?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationId?: string;
}

export interface InvitationData {
  token: string;
  email: string;
  organizationId: string;
  role: User['role'];
}
