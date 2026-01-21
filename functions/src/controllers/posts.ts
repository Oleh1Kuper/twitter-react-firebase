import { CallableRequest, HttpsError, onCall } from 'firebase-functions/https';
import { NewPostPayload } from '../types';
import { db, storage } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export const createPost = onCall(
  async (request: CallableRequest<NewPostPayload>) => {
    const { content, title, imagePath } = request.data;

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized.');
    }

    // TODO: Create better validation
    if (!content || !title) {
      throw new HttpsError(
        'invalid-argument',
        'Title and content are required.',
      );
    }

    const userId = request.auth.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const postRef = db.collection('posts').doc();

    let photoUrl: string | null = null;

    if (imagePath) {
      const bucket = storage.bucket();
      const tempFile = bucket.file(imagePath);

      const finalPath = `posts/${userId}/${postRef.id}`;
      await tempFile.move(finalPath);

      const finalFile = bucket.file(finalPath);
      await finalFile.makePublic();
      photoUrl = finalFile.publicUrl();
    }

    const postData = {
      userId,
      userDisplayName: userData?.displayName || userData?.email || null,
      userPhotoUrl: userData?.photoURL || null,
      title,
      content,
      photoUrl,
      commentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await postRef.set({
      ...postData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { ...postData, id: postRef.id };
  },
);
