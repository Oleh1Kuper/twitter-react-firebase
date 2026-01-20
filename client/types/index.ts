export type User = {
  id: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
  provider: string;
  photoURL: string | null;
  bio: string | null;
};

export type UserPayload = Omit<User, 'email' | 'provider' | 'createdAt'>;
