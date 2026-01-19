import { API_ROUTES } from '@/utils/api-routes';
import { auth } from '@/lib/firebase-client';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useCallback } from 'react';

const useGoogleSignup = () => {
  const handleGoogleSignup = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    try {
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();

      await axios.post(API_ROUTES.AUTH_SESSION, { idToken });

      return cred;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }, []);

  return handleGoogleSignup;
};

export default useGoogleSignup;
