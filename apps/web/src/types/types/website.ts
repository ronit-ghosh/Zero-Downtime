import { z } from "zod";
import { createWebsiteValidation, deleteWebsiteValidation, switchWebsiteValidation, updateWebsiteValidation } from "../validation/website";

export type CreateWebsiteTypes = z.infer<typeof createWebsiteValidation>;
export type UpdateWebsiteTypes = z.infer<typeof updateWebsiteValidation>;
export type DeleteWebsiteTypes = z.infer<typeof deleteWebsiteValidation>;
export type SwitchWebsiteTypes = z.infer<typeof switchWebsiteValidation>;
