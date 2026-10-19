export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobTitle: string;
  department?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface DeleteResponse {
  success: boolean;
}