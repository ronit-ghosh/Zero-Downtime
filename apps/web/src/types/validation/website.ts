import { ErrorMessages } from "@/lib/utils";
import { z } from "zod";

export const createWebsiteValidation = z.object({
  url: z.string({ error: ErrorMessages.STR }),
});
