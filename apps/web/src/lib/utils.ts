import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ErrorMessages = {
  STR: "[zod]: Invalid String!",
  NUM: "[zod]: Invalid Number!",
  BOOL: "[zod]: Invalid Boolean!",
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
