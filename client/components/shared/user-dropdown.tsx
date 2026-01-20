'use client';

import { useRouter } from 'next/navigation';

import axios from 'axios';
import { LogOut, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useMyInfo from '@/hooks/use-my-info';
import { auth } from '@/lib/firebase-client';
import { API_ROUTES } from '@/utils/api-routes';
import { CLIENT_ROUTES } from '@/utils/client-rotes';

const UserDropdown = () => {
  const router = useRouter();
  const { myInfo, initials } = useMyInfo();

  const handleLogout = async () => {
    const idToken = await auth.currentUser?.getIdToken();

    await axios.post(API_ROUTES.AUTH_REMOVE_SESSION, { idToken });
    await auth.signOut();

    router.push(CLIENT_ROUTES.LOGIN);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={myInfo?.photoURL || undefined}
              alt={myInfo?.displayName || 'User Avatar'}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {myInfo?.displayName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {myInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(CLIENT_ROUTES.PROFILE)}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
