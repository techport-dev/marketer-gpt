import baseApi from "./baseApi";

type AiResponseType = {
  role: string;
  content: string;
  msg: string;
};

const aiResponseApi = {
  generateTitleMutation: async (formData: FormData) => {
    const response = await baseApi({
      url: "/gpt/aiResponse/title",
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
  generateCommentMutation: async (data: any) => {
    const response = await baseApi({
      url: "/gpt/aiResponse/comment",
      method: "POST",
      data: data,
    });

    return response.data;
  },
};

export const { generateTitleMutation, generateCommentMutation } = aiResponseApi;
