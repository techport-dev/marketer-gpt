import { z } from "zod";

const commentGenerateFormSchema = z.object({
  commentType: z.string().trim().min(1, {
    message: "commentType is Required",
  }),
  url: z
    .string()
    .trim()
    .min(1, {
      message: "Url is Required",
    })
    .refine((value) => /^(http|https):\/\/[^ "]+$/.test(value), {
      message: "Please enter a valid url.",
    }),
});

export default commentGenerateFormSchema;
