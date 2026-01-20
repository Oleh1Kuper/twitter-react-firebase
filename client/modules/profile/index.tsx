'use client';

import useMyInfo from '@/hooks/use-my-info';

import PasswordForm from './components/password-form';
import ProfileForm from './components/profile-form';

const Profile = () => {
  const { myInfo } = useMyInfo();

  return (
    <section className="space-y-8 rounded-2xl">
      <h2 className="text-foreground text-center text-xl font-semibold">
        Account Settings
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <ProfileForm />
        {myInfo?.provider === 'password' && <PasswordForm />}
      </div>
    </section>
  );
};

export default Profile;
