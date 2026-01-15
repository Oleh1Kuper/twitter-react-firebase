import * as functions from 'firebase-functions/v1';
import admin, { db } from '../config/firebase';

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  await db
    .collection('users')
    .doc(user.uid)
    .set({
      id: user.uid,
      email: user.email ?? null,
      provider: user.providerData[0]?.providerId ?? 'password',
      displayName: user.displayName ?? null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
});
