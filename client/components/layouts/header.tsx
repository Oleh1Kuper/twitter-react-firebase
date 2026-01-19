import UserDropdown from '../shared/user-dropdown';

const Header = () => {
  return (
    <header className="border-border bg-background flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-foreground text-xl font-semibold">
        Twitter clone app
      </h1>
      <UserDropdown />
    </header>
  );
};

export default Header;
