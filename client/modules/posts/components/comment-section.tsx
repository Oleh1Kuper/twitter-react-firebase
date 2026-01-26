'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

import PostServices from '../api';
import { commentSchema } from '../schema';
import { Comment } from '../types';
import CommentItem from './comment-item';

type CommentSectionProps = {
  comments: Comment[];
  postId: string;
};

type CommentFormData = z.infer<typeof commentSchema>;

const CommentSection = ({ comments, postId }: CommentSectionProps) => {
  const form = useForm<CommentFormData>({
    defaultValues: { comment: '' },
    resolver: zodResolver(commentSchema),
  });

  const handleSubmitComment = async (data: CommentFormData) => {
    try {
      await PostServices.addComment({ content: data.comment, postId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmitComment)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write a comment..."
                    className="min-h-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">Comment</Button>
          </div>
        </form>
      </Form>

      {comments.length > 0 ? (
        <ScrollArea
          viewportClassName="max-h-[200px] pr-3"
          className="flex flex-col gap-4"
        >
          {comments.map((comment) => (
            <CommentItem postId={postId} key={comment.id} comment={comment} />
          ))}
        </ScrollArea>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          No comments yet.
        </p>
      )}
    </div>
  );
};

export default CommentSection;
