import { storage } from '../config/firebase';

type PostImageProps = {
  imagePath: string;
  userId: string;
  postId: string;
  oldPhotoPath?: string;
};

const uploadPostImage = async ({
  imagePath,
  userId,
  postId,
  oldPhotoPath,
}: PostImageProps) => {
  const bucket = storage.bucket();
  const tempFile = bucket.file(imagePath);
  const newPath = `posts/${userId}/${postId}_${Date.now()}`;

  await tempFile.move(newPath);

  const newFile = bucket.file(newPath);
  await newFile.makePublic();

  if (oldPhotoPath && oldPhotoPath !== newPath) {
    try {
      await bucket.file(oldPhotoPath).delete();
    } catch (err) {
      console.warn('Failed to delete old image:', oldPhotoPath);
    }
  }

  return {
    photoUrl: newFile.publicUrl(),
    photoPath: newPath,
  };
};

export default uploadPostImage;
