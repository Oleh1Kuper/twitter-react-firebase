export type Comment = {
  id: string;
  userId: string;
  postId: string;
  userDisplayName: string;
  userPhotoUrl: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  repliesCount: number;
};

export type Reply = Omit<Comment, 'postId' | 'repliesCount'> & {
  commentId: string;
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

export type NewPostPayload = {
  title: string;
  content: string;
  imagePath?: string;
};

export type UpdatePostPayload = Partial<NewPostPayload> & {
  postId: string;
};

export type AddCommentPayload = {
  postId: string;
  content: string;
};

export type AddReplyPayload = AddCommentPayload & {
  commentId: string;
};

export type GetRepliesProps = {
  postId: string;
  commentId: string;
};
