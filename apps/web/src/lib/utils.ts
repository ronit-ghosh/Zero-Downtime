import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ErrorMessages = {
  STR: "[zod]: Invalid String!",
  NUM: "[zod]: Invalid Number!",
  BOOL: "[zod]: Invalid Boolean!",
}