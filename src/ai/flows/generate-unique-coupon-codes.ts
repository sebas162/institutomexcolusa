// NOTA: 'use server' comentado para permitir static export
// Este flujo de AI probablemente necesite una API route externa
// 'use server';

/**
 * @fileOverview A unique coupon code generator AI agent.
 *
 * - generateUniqueCouponCode - A function that generates a unique coupon code.
 * - GenerateUniqueCouponCodeInput - The input type for the generateUniqueCouponCode function.
 * - GenerateUniqueCouponCodeOutput - The return type for the generateUniqueCouponCode function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateUniqueCouponCodeInputSchema = z.object({
  durationDays: z
    .number()
    .describe("The duration of the coupon in days, either 15 or 30."),
});
export type GenerateUniqueCouponCodeInput = z.infer<
  typeof GenerateUniqueCouponCodeInputSchema
>;

const GenerateUniqueCouponCodeOutputSchema = z.object({
  couponCode: z.string().describe("The generated unique coupon code."),
});
export type GenerateUniqueCouponCodeOutput = z.infer<
  typeof GenerateUniqueCouponCodeOutputSchema
>;

export async function generateUniqueCouponCode(
  input: GenerateUniqueCouponCodeInput
): Promise<GenerateUniqueCouponCodeOutput> {
  return generateUniqueCouponCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateUniqueCouponCodePrompt",
  input: { schema: GenerateUniqueCouponCodeInputSchema },
  output: { schema: GenerateUniqueCouponCodeOutputSchema },
  prompt: `You are a marketing expert specializing in generating unique and attractive coupon codes.

You will generate a unique coupon code that is easy to remember and relevant to online education.

The coupon code should be a combination of letters and numbers, and its duration is valid for {{durationDays}} days.

Ensure the coupon code is unique and has not been previously generated.

Consider the duration when creating the coupon code. The shorter duration coupons should have shorter codes, and longer durations can have longer codes.

Generate the coupon code:`,
});

const generateUniqueCouponCodeFlow = ai.defineFlow(
  {
    name: "generateUniqueCouponCodeFlow",
    inputSchema: GenerateUniqueCouponCodeInputSchema,
    outputSchema: GenerateUniqueCouponCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
