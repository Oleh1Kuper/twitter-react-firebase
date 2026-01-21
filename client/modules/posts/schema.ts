import z from 'zod';

export const postSchema = z.object({
  file: z.instanceof(File).optional(),
  title: z.string().min(3, 'Title is required.'),
  content: z
    .string()
    .min(3, 'Content is required.')
    .max(500, 'Content must be at most 500 character.'),
});
