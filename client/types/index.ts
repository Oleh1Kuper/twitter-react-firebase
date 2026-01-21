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

export type NewPostPayload = {
  title: string;
  content: string;
  imagePath?: string;
};

export type Comment = {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  subcomments?: Comment[];
};

export type Post = {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoUrl: string | null;
  commentsCount: number;
  content: string;
  title: string;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
