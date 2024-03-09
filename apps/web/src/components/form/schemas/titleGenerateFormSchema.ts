import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const titleGenerateFormSchema = z.object({
  // images: z
  //   .instanceof(File)
  //   .refine((file) => {
  //     return file.name !== "";
  //   }, `Required`)
  //   .refine(
  //     (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
  //     "Invalid file type"
  //   ),
  imageDescription: z.string(),
  subreddit: z.string(),
  lengthLimit: z.string(),
  avoidenceKeywords: z.string(),
  reference: z.string(),
});

export default titleGenerateFormSchema;
