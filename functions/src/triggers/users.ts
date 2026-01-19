import * as functions from 'firebase-functions/v1';
import admin, { db } from '../config/firebase';

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  await db
    .collection('users')
    .doc(user.uid)
    .set({
      id: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      bio: null,
      provider: user.providerData[0]?.providerId ?? 'password',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
});

export const onUserDelete = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection('users').doc(user.uid);

  return doc.delete();
});
