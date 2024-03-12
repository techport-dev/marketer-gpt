import { z } from "zod";

const commentGenerateFormSchema = z.object({
  commentType: z.string().trim().min(1, {
    message: "commentType is Required",
  }),
  url: z.string().trim().min(1, {
    message: "Url is Required",
  }),
});

export default commentGenerateFormSchema;
