'use client';

import Link from 'next/link';

import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { VerifyStatus } from '../types';

interface VerifiedContentProps {
  status: VerifyStatus;
  onRetry?: () => void;
}

const VerifiedContent = ({ status, onRetry }: VerifiedContentProps) => {
  if (status === 'verifying') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
          <CardTitle className="text-2xl">Verifying email</CardTitle>
          <CardDescription className="text-balance">
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <XCircle className="text-destructive h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Verification failed</CardTitle>
          <CardDescription className="text-balance">
            We couldn&apos;t verify your email address. The link may have
            expired or already been used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Please request a new verification email and try again.
          </p>
          <div className="flex flex-col gap-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                className="w-full bg-transparent"
              >
                Try again
              </Button>
            )}
            <Button asChild className="w-full">
              <Link href="/verify-email">Request new verification</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'invalid') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Invalid link</CardTitle>
          <CardDescription className="text-balance">
            This verification link is invalid or has been corrupted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center text-sm">
            Please check your email for the correct link or request a new
            verification email.
          </p>
          <Button asChild className="w-full">
            <Link href="/">Go to homepage</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <CardTitle className="text-2xl">Email verified</CardTitle>
        <CardDescription className="text-balance">
          Your email address has been successfully verified. You can now access
          all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-center text-sm">
          Thank you for verifying your email. Your account is now fully
          activated.
        </p>
        <Button asChild className="w-full">
          <Link href="/">Continue to app</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerifiedContent;
