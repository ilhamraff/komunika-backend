import z from "zod";

export const withdrawSchema = z.object({
  amount: z.number(),
  bankName: z.enum(["BCA", "MANDIRI", "BRI"]),
  bankAccountNumber: z.number(),
  bankAccountName: z.string(),
});

export type WithdrawValues = z.infer<typeof withdrawSchema>;
