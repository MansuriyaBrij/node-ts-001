import { z } from 'zod';


//   id          Int       @id @default(autoincrement())
//   title       String
//   content     String
//   tags        Json?     // ✅ MySQL-compatible for array
//   published   Boolean   @default(false)
// }

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  // userId is not included here as it will be set by the middleware
  // when the user is authenticated


});

export const updatePostSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});