// Organization and project-related types

export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Timesheet {
  id: string;
  userId: string;
  weekStartDate: string;
  entries: TimeEntry[];
  totalHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
}
