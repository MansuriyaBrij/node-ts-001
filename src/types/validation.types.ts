
import { ZodType } from 'zod';
import { ZodSchema } from 'zod';


export type ValidationTarget = 'body' | 'query' | 'params';

export type ZodValidator = {
  schema: ZodSchema;
  target?: ValidationTarget;
};
