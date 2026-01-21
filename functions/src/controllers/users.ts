import {
  onCall,
  HttpsError,
  CallableRequest,
} from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import { UserPayload } from '../types';
import { getAuth } from 'firebase-admin/auth';

export const updateUser = onCall(
  async (request: CallableRequest<UserPayload>) => {
    const { id, ...payload } = request.data;

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required');
    }

    if (request.auth.uid !== id) {
      throw new HttpsError('permission-denied', 'No permission to update');
    }

    await getAuth().updateUser(id, {
      displayName: payload.displayName,
      photoURL: payload.photoURL,
    });

    await db.collection('users').doc(id).update(payload);

    return { success: true };
  },
);
