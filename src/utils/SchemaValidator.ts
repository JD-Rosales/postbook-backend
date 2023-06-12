import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject, data: unknown): ZodError => {
  try {
    return schema.parse(data) as ZodError;
  } catch (error) {
    if (error instanceof ZodError) {
      return error;
    } else {
      throw error;
    }
  }
};

export default validate;
