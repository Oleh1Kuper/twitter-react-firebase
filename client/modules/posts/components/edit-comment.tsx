import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { EllipsisVertical, Pencil } from 'lucide-react';

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
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import { CommentFormData } from '../hooks/use-comment-form';
import { commentSchema } from '../schema';

type Props = {
  comment: string;
}

const EditComment = ({ comment }: Props) => {
  const form = useForm<CommentFormData>({
    defaultValues: { comment },
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = () => {};

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost" className="h-fit w-fit p-1">
            <Pencil />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Edit comment</DialogTitle>
            <DialogDescription className="sr-only">
              Make changes to your comment here.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
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
                        placeholder="Edit comment"
                        className="min-h-20"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditComment;
