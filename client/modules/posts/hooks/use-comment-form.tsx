import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import PostServices from '../api';
import { commentSchema } from '../schema';

export type CommentFormData = z.infer<typeof commentSchema>;

const useCommentForm = (commentId: string, postId: string) => {
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (data: CommentFormData) => {
      await PostServices.addReply({
        commentId,
        postId,
        content: data.comment,
      });
    },
    [commentId, postId],
  );

  const form = useForm<CommentFormData>({
    defaultValues: { comment: '' },
    resolver: zodResolver(commentSchema),
  });

  const FormContent = useMemo(
    () => (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="ml-11 flex flex-col gap-2"
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
                    className="min-h-15 text-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setShowReplyInput(!showReplyInput)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Reply
            </Button>
          </div>
        </form>
      </Form>
    ),
    [form, onSubmit, showReplyInput],
  );

  return {
    form,
    FormContent,
    showReplyInput,
    setShowReplyInput,
  };
};

export default useCommentForm;
