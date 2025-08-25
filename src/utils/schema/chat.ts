import z from "zod";

export const createRoomPersonalSchema = z
  .object({
    userId: z.string(),
  })
  .strict();

export const createMessageSchema = z.object({
  message: z.string(),
  roomId: z.string(),
});

export type CreateRoomPersonalValue = z.infer<typeof createRoomPersonalSchema>;
export type CreateMessageValues = z.infer<typeof createMessageSchema>;
