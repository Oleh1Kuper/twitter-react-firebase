import { CallableRequest, HttpsError, onCall } from 'firebase-functions/https';
import { NewPostPayload, UpdatePostPayload } from '../types';
import { db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import uploadPostImage from '../utils/uploadPostImage';

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
    let photoPath: string | null = null;

    if (imagePath) {
      const uploaded = await uploadPostImage({
        postId: postRef.id,
        userId,
        imagePath,
      });

      if (uploaded) {
        photoUrl = uploaded.photoUrl;
        photoPath = uploaded.photoPath;
      }
    }

    const postData = {
      userId,
      userDisplayName: userData?.displayName || userData?.email || null,
      userPhotoUrl: userData?.photoURL || null,
      title,
      content,
      photoUrl,
      photoPath,
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

export const updatePost = onCall(
  async (request: CallableRequest<UpdatePostPayload>) => {
    const { content, title, imagePath, postId } = request.data;

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized.');
    }

    if (!postId) {
      throw new HttpsError('invalid-argument', 'postId is required.');
    }

    // TODO: Create better validation
    if (!content && !title && !imagePath) {
      throw new HttpsError(
        'invalid-argument',
        'At least one field must be updated.',
      );
    }

    const userId = request.auth.uid;
    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      throw new HttpsError('not-found', 'Post not found.');
    }

    const postData = postSnap.data();

    if (postData?.userId !== userId) {
      throw new HttpsError(
        'permission-denied',
        'You can update only your posts.',
      );
    }

    let photoUrl = postData?.photoUrl;
    let photoPath = postData?.photoPath;

    if (imagePath) {
      const uploaded = await uploadPostImage({
        imagePath,
        userId,
        postId,
        oldPhotoPath: postData?.photoPath,
      });

      if (uploaded) {
        photoUrl = uploaded.photoUrl;
        photoPath = uploaded.photoPath;
      }
    }

    const updatePayload = {
      updatedAt: FieldValue.serverTimestamp(),
      photoUrl,
      photoPath,
      title: title || postData.title,
      content: content || postData.content,
    };

    await postRef.update(updatePayload);

    return { id: postId };
  },
);
