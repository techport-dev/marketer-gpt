import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const titleGenerateFormSchema = z.object({
  images: z
    .instanceof(File)
    .refine((file) => {
      return file.name !== "";
    }, `Required`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid file type"
    ),
  imageDescription: z.string().trim().min(1, {
    message: "Imagedesc is Required",
  }),
  subreddit: z.string().trim().min(1, {
    message: "Subreddit is Required",
  }),
  lengthLimit: z.string().trim().min(1, {
    message: "Length Limit is Required",
  }),
  avoidenceKeywords: z.string().trim().min(1, {
    message: "Avoidence Keywords is Required",
  }),
  reference: z.string().trim().min(1, {
    message: "Reference is Required",
  }),
});

export default titleGenerateFormSchema;
