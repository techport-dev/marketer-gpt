import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FileWithPreview = {
  preview: string;
} & File;

export type ImageStateType = {
  files: Array<FileWithPreview>;
  referenceImages: Array<string>;
};

const initialState: ImageStateType = {
  files: [],
  referenceImages: [],
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<Array<FileWithPreview>>) => {
      state.files = action.payload;
    },
    setReferenceImages: (state, action: PayloadAction<Array<string>>) => {
      state.referenceImages = action.payload;
    },
  },
});
