'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import { CLIENT_ROUTES } from '@/lib/client-rotes';
import { auth } from '@/lib/firebase-client';

export default function Page() {
  const router = useRouter();
  const onClick = async () => {
    const idToken = await auth.currentUser?.getIdToken();

    await axios.post('/api/auth/remove-session', { idToken });
    await auth.signOut();

    router.push(CLIENT_ROUTES.LOGIN);
  };

  return <Button onClick={onClick}>Logout</Button>;
}
