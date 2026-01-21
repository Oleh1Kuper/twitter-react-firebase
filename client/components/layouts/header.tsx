import Link from 'next/link';

import { Plus } from 'lucide-react';

import { CLIENT_ROUTES } from '@/utils/client-rotes';

import PostDialog from '../shared/post-dialog';
import UserDropdown from '../shared/user-dropdown';
import { Button } from '../ui/button';

const Header = () => {
  return (
    <header className="border-border bg-background flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-foreground text-xl font-semibold">
        <Link href={CLIENT_ROUTES.HOME}>Twitter clone app</Link>
      </h1>
      <div className="flex items-center gap-3">
        <PostDialog>
          <Button size="sm" className="shrink-0">
            <Plus className="size-4!" />
            Create new post
          </Button>
        </PostDialog>
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
