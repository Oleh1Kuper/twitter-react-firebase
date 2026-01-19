'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import z from 'zod';

import GoogleIcon from '@/components/icons/google-icon';
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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import useDialogStates from '@/hooks/use-dialog-states';
import useGoogleSignup from '@/hooks/use-google-signup';
import { API_ROUTES } from '@/lib/api-routes';
import { CLIENT_ROUTES } from '@/lib/client-rotes';
import { auth } from '@/lib/firebase-client';

import { loginSchema } from '../schema';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const googleSignup = useGoogleSignup();
  const { isLoading, setIsLoading } = useDialogStates();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const idToken = await cred.user.getIdToken();

      await axios.post(API_ROUTES.AUTH_SESSION, { idToken });

      if (!cred.user.emailVerified) {
        router.push(CLIENT_ROUTES.VERIFY_EMAIL);
      } else {
        router.push(CLIENT_ROUTES.HOME);
      }
    } catch {
      form.setError('email', {
        type: 'manual',
        message: 'Invalid email or password.',
      });
      form.setError('password', {
        type: 'manual',
        message: 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const cred = await googleSignup();

      if (!cred.user.emailVerified) {
        router.push(CLIENT_ROUTES.VERIFY_EMAIL);
      } else {
        router.push(CLIENT_ROUTES.HOME);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full font-medium"
            >
              Log In
              {isLoading && <Spinner />}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full bg-transparent font-medium"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-foreground hover:text-primary font-medium underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
