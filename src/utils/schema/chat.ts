import z from "zod";

export const createRoomPersonalSchema = z
  .object({
    userId: z.string(),
  })
  .strict();

export type CreateRoomPersonalValue = z.infer<typeof createRoomPersonalSchema>;
