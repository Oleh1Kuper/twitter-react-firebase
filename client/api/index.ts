import { db, functions, storage } from '@/lib/firebase-client';
import { NewPostPayload, Post, User, UserPayload } from '@/types';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

class Services {
  static async getMyInfo(userId: string): Promise<User | null> {
    if (!userId) {
      throw new Error('User ID is required to fetch user info');
    }

    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return null;
    }

    return snap.data() as User;
  }

  static async uploadAvatar(file: File, userId: string) {
    const avatarRef = ref(storage, `avatars/${userId}/avatar.png`);

    await uploadBytes(avatarRef, file, {
      contentType: file.type,
    });

    return await getDownloadURL(avatarRef);
  }

  static async updateUser(payload: UserPayload) {
    const updateUser = httpsCallable(functions, 'updateUser');
    return await updateUser(payload);
  }

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

}

export default Services;
