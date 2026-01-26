import { onCall, HttpsError, CallableRequest } from 'firebase-functions/https';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase';
import { AddCommentPayload, AddReplyPayload } from '../types';

export const createComment = onCall(
  async (request: CallableRequest<AddCommentPayload>) => {
    const { content, postId } = request.data;

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized.');
    }

    if (!content?.trim() || !postId) {
      throw new HttpsError(
        'invalid-argument',
        'Content and postId are required.',
      );
    }

    const userId = request.auth.uid;

    const userSnap = await db.collection('users').doc(userId).get();
    const userData = userSnap.data();

    const postRef = db.collection('posts').doc(postId);
    const commentRef = postRef.collection('comments').doc();

    const commentData = {
      userId,
      postId,
      userDisplayName: userData?.displayName ?? null,
      userPhotoUrl: userData?.photoURL || null,
      content: content.trim(),
      repliesCount: 0,
    };

    await db.runTransaction(async (tx) => {
      const postSnap = await tx.get(postRef);

      if (!postSnap.exists) {
        throw new HttpsError('not-found', 'Post not found.');
      }

      tx.update(postRef, {
        commentsCount: FieldValue.increment(1),
      });

      tx.set(commentRef, {
        ...commentData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    return {
      id: commentRef.id,
      ...commentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
);

export const createReply = onCall(
  async (request: CallableRequest<AddReplyPayload>) => {
    const { content, postId, commentId } = request.data;

    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Unauthorized.');
    }

    if (!content?.trim() || !postId || !commentId) {
      throw new HttpsError(
        'invalid-argument',
        'Content, postId, and commentId are required.',
      );
    }

    const userId = request.auth.uid;
    const userSnap = await db.collection('users').doc(userId).get();
    const userData = userSnap.data();

    const postRef = db.collection('posts').doc(postId);
    const commentRef = postRef.collection('comments').doc(commentId);
    const replyRef = commentRef.collection('replies').doc();

    const replyData = {
      userId,
      commentId,
      userDisplayName: userData?.displayName ?? null,
      userPhotoUrl: userData?.photoURL ?? null,
      content: content.trim(),
    };

    await db.runTransaction(async (tx) => {
      const commentSnap = await tx.get(commentRef);
      const postSnap = await tx.get(postRef);

      if (!commentSnap.exists) {
        throw new HttpsError('not-found', 'Comment not found.');
      }

      if (!postSnap.exists) {
        throw new HttpsError('not-found', 'Post not found.');
      }

      tx.update(commentRef, {
        repliesCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.update(postRef, {
        commentsCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });

      tx.set(replyRef, {
        ...replyData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    return {
      id: replyRef.id,
      ...replyData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
);
