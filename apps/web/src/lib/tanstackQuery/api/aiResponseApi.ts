import baseApi from "./baseApi";

type AiResponseType = {
  role: string;
  content: string;
  msg: string;
};

const aiResponseApi = {
  aiResponseMutation: async (data: any): Promise<AiResponseType> => {
    const response = await baseApi({
      url: "/gpt/aiResponse",
      method: "POST",
      data: data,
    });
    return response.data;
  },
};

export const { aiResponseMutation } = aiResponseApi;
