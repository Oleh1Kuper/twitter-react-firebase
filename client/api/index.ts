import { db, functions, storage } from '@/lib/firebase-client';
import { User, UserPayload } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
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
}

export default Services;
