export type UserPayload = {
  id: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
};

export type NewPostPayload = {
  title: string;
  content: string;
  imagePath?: string;
};
