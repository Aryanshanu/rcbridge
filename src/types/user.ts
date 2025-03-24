
export type UserRole = "admin" | "developer" | "maintainer";

export interface UserProfile {
  id: string;
  email?: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  preferences?: any;
  invite_used?: string | null;
}
