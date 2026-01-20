'use client';

import React, { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

type Props = Omit<React.ComponentProps<'input'>, 'type'>;

const PasswordInput = ({ className, ...props }: Props) => {
  const [visible, setVisible] = useState(false);

  const onChangeVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        className={cn('pr-2.5', className)}
        {...props}
        type={visible ? 'text' : 'password'}
      />

      <Button
        variant="ghost"
        className="absolute top-1/2 right-3.5 h-fit w-fit -translate-y-1/2 px-0.5! py-1 hover:bg-transparent"
        onClick={onChangeVisible}
        type="button"
        aria-label="Toggle password visibility"
      >
        {!visible ? (
          <Eye className="text-muted-foreground" />
        ) : (
          <EyeOff className="text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export default PasswordInput;
