'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, X } from 'lucide-react';
import z from 'zod';

import Services from '@/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { auth } from '@/lib/firebase-client';
import { postSchema } from '@/modules/posts/schema';
import type { Post } from '@/types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

type PostFromData = z.infer<typeof postSchema>;

type EditPostDialogProps = {
  post?: Post;
  children: React.ReactNode;
};

const PostDialog = ({ post, children }: EditPostDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm<PostFromData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      title: '',
    },
  });

  const onSubmit = async ({ content, title, file }: PostFromData) => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      let imagePath: string | undefined;

      if (file) {
        imagePath = await Services.uploadPostImage(file, user.uid);
      }

      const res = await Services.createPost({ content, title, imagePath });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
    form.setValue('file', file);
  };

  const handleRemovePhoto = () => {
    setImagePreview('');
    form.reset({ file: undefined });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{!post ? 'Create Post' : 'Edit Post'} </DialogTitle>
          <DialogDescription className="sr-only">
            Make changes to your post. Or add a new one
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {imagePreview ? (
              <div className="relative aspect-video w-full rounded-md">
                <Button
                  aria-label="Delete post image"
                  variant="outline"
                  className="absolute top-2 right-2 z-20"
                  type="button"
                  onClick={handleRemovePhoto}
                >
                  <X className="size-4!" />
                </Button>
                <Image
                  className="rounded-md"
                  src={imagePreview}
                  fill
                  alt="Post image"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="photo">Photo (optional)</Label>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border bg-muted/50 text-muted-foreground hover:border-primary hover:bg-muted flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
                >
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm">Click to upload a photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-30"
                      placeholder="Enter post content"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
