import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { type AxiosError } from "axios";

export const errorFn = (err: AxiosError) => {
  if (err.message.includes("500")) {
    return "Something went wrong. please try again later";
  } else {
    return (err.response?.data as any)?.error;
  }
};
