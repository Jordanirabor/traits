// User types for authentication
export interface User {
  id: string;
  email?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}

export interface AuthSession {
  user: User;
  session: Session;
}
