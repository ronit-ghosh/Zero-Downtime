import { ErrorMessages } from "@/lib/utils";
import { z } from "zod";

export const createWebsiteValidation = z.object({
  name: z.string({ error: ErrorMessages.STR }),
  url: z.string({ error: ErrorMessages.STR }),
});

export const updateWebsiteValidation = z.object({
  websiteId: z.string({ error: ErrorMessages.STR }),
  name: z.string({ error: ErrorMessages.STR }),
  url: z.string({ error: ErrorMessages.STR }),
});

export const deleteWebsiteValidation = z.object({
  websiteId: z.string({ error: ErrorMessages.STR }),
});

export const switchWebsiteValidation = z.object({
  websiteId: z.string({ error: ErrorMessages.STR }),
  isTracking: z.boolean({ error: ErrorMessages.BOOL }),
});
