'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { FirebaseError } from 'firebase/app';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import * as z from 'zod';

import PasswordInput from '@/components/shared/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import useDialogStates from '@/hooks/use-dialog-states';
import { auth } from '@/lib/firebase-client';
import { API_ROUTES } from '@/utils/api-routes';

import { passwordsSchema } from '../schema';

type PasswordFormValues = z.infer<typeof passwordsSchema>;

const PasswordForm = () => {
  const { isLoading, setIsLoading } = useDialogStates();
  const [isToManyRequests, setIsToManyRequests] = useState<boolean>(false);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordsSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    const user = auth.currentUser;

    if (!user || !user.email) return;

    setIsLoading(true);
    setIsToManyRequests(false);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword,
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.confirmPassword);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          form.setError('currentPassword', {
            message: 'Incorrect current password',
          });
          return;
        }

        if (error.code === 'auth/too-many-requests') {
          setIsToManyRequests(true);
          return;
        }
      }

      alert('Failed to update password.');
      return;
    }

    try {
      const idToken = await user.getIdToken(true);
      await axios.post(API_ROUTES.AUTH_SESSION, { idToken });
    } catch (error) {
      console.warn('Password updated but session refresh failed', error);
    }

    form.reset();
    setIsLoading(false);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isToManyRequests && (
              <div className="text-destructive bg-destructive/10 rounded-md p-2">
                <p>Too many attempts. Try again later.</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                Update Password {isLoading && <Spinner />}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
