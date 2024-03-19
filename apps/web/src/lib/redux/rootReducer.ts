import { aiResponseSlice } from "./slices/aiResponse";
import { imageSlice } from "./slices/image";

export const reducer = {
  image: imageSlice.reducer,
  aiResponse: aiResponseSlice.reducer,
};
