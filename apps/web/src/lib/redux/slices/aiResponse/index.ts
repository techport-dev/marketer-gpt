import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AiResponseType = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string;
  data: {
    role: string;
    content: string;
    msg: string;
  };
};

const initialState: AiResponseType = {
  isLoading: true,
  isSuccess: false,
  isError: false,
  error: "",
  data: {
    role: "",
    content: "",
    msg: "",
  },
};

export const aiResponseSlice = createSlice({
  name: "aiResponse",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
      state.error = "";
    },
    setIsSuccess: (
      state,
      action: PayloadAction<{ role: string; content: string; msg: string }>
    ) => {
      state.isLoading = false;
      state.isSuccess = true;
      // state.data = [...state.data, action.payload];
      state.data = action.payload;
    },
    setIsError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.error = action.payload;
    },
  },
});
