'use client';

import { useState } from 'react';

import { sendEmailVerification } from 'firebase/auth';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/firebase-client';

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;

    setIsLoading(true);

    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsSent(true);
    }
  };

  if (isSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription className="text-balance">
            We&apos;ve sent a verification link to{' '}
            <span className="text-foreground font-medium">
              {auth.currentUser?.email ?? ''}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Click the link in the email to verify your address. If you
            don&apos;t see it, check your spam folder.
          </p>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleSendVerification}
            disabled={isLoading}
          >
            Resend link
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Mail className="text-primary h-8 w-8" />
        </div>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          onClick={handleSendVerification}
          disabled={isLoading}
        >
          Send verification link
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
