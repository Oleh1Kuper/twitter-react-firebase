import { connection } from 'next/server';

import EmailVerified from '@/modules/auth/components/email-verified';

const EmailVerifiedPage = async () => {
  await connection();
  return <EmailVerified />;
};

export default EmailVerifiedPage;
