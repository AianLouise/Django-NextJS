// Common types and utility interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

export interface FormErrors {
  [key: string]: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterOptions {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  [key: string]: any;
}
