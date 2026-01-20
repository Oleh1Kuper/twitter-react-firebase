import z from 'zod';

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(16, 'Password must be at most 16 characters');

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
  })
  .required();

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters'),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters'),

    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
