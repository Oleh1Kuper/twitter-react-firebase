import PasswordForm from './components/password-form';
import ProfileForm from './components/profile-form';

const Profile = () => {
  return (
    <section className="rounded-2xl space-y-8">
      <h2 className="text-foreground text-center text-xl font-semibold">
        Account Settings
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <ProfileForm />
        <PasswordForm />
      </div>
    </section>
  );
};

export default Profile;
