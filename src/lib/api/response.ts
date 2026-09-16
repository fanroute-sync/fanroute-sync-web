import { z } from 'zod';

export const envelope = <T extends z.ZodType>(data: T) => z.object({
  success: z.literal(true),
  status: z.number(),
  code: z.string(),
  message: z.string(),
  data,
});

export const page = <T extends z.ZodType>(item: T) => z.object({
  content: z.array(item),
  number: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});
