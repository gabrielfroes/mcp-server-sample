import { z } from "zod";

export const PriceByZipCodeInputSchema = z.object({
  from: z.object({
    postal_code: z.string().min(8).max(9),
  }),
  to: z.object({
    postal_code: z.string().min(8).max(9),
  }),
  package: z.object({
    height: z.number(),
    width: z.number(),
    length: z.number(),
    weight: z.number(),
  }),
});

export type PriceByZipCodeInput = z.infer<typeof PriceByZipCodeInputSchema>;

export interface PriceByZipCodeResult {
  name: string;
  price: string;
  custom_price: string;
}
