'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import axios from 'axios';
import { applyActionCode } from 'firebase/auth';

import { API_ROUTES } from '@/lib/api-routes';
import { auth } from '@/lib/firebase-client';

import { VerifyStatus } from '../types';
import VerifiedContent from './verified-content';

const EmailVerified = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [status, setStatus] = useState<VerifyStatus>('verifying');

  const onVerify = useEffectEvent(async (oobCode: string | null) => {
    if (!oobCode) {
      setStatus('invalid');
      return;
    }

    try {
      await applyActionCode(auth, oobCode);
      await auth.currentUser?.reload();

      const idToken = await auth.currentUser?.getIdToken(true);

      if (idToken) {
        // update session cookie with verified email
        await axios.post(API_ROUTES.AUTH_SESSION, { idToken });
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  });

  useEffect(() => {
    onVerify(oobCode);
  }, [oobCode]);

  return <VerifiedContent status={status} />;
};

export default EmailVerified;
