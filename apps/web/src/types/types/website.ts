import { z } from "zod";
import { createWebsiteValidation } from "../validation/website";

export type CreateWebsiteTypes = z.infer<typeof createWebsiteValidation>;
