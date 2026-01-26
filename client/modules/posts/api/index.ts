import { db, functions, storage } from '@/lib/firebase-client';
import {
  AddCommentPayload,
  AddReplyPayload,
  Comment,
  GetRepliesProps,
  NewPostPayload,
  Post,
  Reply,
  UpdatePostPayload,
} from '../types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { ref, uploadBytes } from 'firebase/storage';

class PostServices {
  static async uploadPostImage(file: File, userId: string) {
    const imagePath = `tempPosts/${userId}/${crypto.randomUUID()}`;
    const postImageRef = ref(storage, imagePath);

    await uploadBytes(postImageRef, file, {
      contentType: file.type,
    });

    return imagePath;
  }

  static async createPost(payload: NewPostPayload) {
    const createNewPost = httpsCallable(functions, 'createPost');
    return await createNewPost(payload);
  }

  static async updatePost(payload: UpdatePostPayload) {
    const updatePostFunc = httpsCallable(functions, 'updatePost');
    return await updatePostFunc(payload);
  }

  static async getPosts(): Promise<Post[]> {
    const snapshot = await getDocs(collection(db, 'posts'));

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Post;
    });
  }

  static async addComment(payload: AddCommentPayload) {
    const createComment = httpsCallable(functions, 'createComment');
    return await createComment(payload);
  }

  static async getComments(postId: string) {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Comment;
    });
  }

  static async getReplies({ commentId, postId }: GetRepliesProps) {
    const q = query(
      collection(db, 'posts', postId, 'comments', commentId, 'replies'),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Reply;
    });
  }

  static async addReply(payload: AddReplyPayload) {
    const createReply = httpsCallable(functions, 'createReply');
    return await createReply(payload);
  }
}

export default PostServices;
