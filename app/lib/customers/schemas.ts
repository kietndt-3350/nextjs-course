import { z } from 'zod';

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter customer name.',
  }),
  email: z.string({ invalid_type_error: 'Invalid email format.' }),
  image_url: z.string({ invalid_type_error: 'Customer image required.' }),
});

export const CreateCustomerSchema = CustomerSchema.omit({ id: true });
export const UpdateCustomerSchema = CustomerSchema.omit({ id: true });
