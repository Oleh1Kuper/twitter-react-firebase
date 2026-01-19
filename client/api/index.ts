import { db } from '@/lib/firebase-client';
import { User } from '@/types';
import { doc, getDoc } from 'firebase/firestore';

class Services {
  static async getMyInfo(userId: string): Promise<User | null> {
    if (!userId) {
      throw new Error('User ID is required to fetch user info');
    }

    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        return null;
      }

      return snap.data() as User;
    } catch (error) {
      throw error;
    }
  }
}

export default Services;
