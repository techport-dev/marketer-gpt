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
  generateTitleMutation: async (formData: FormData) => {
    console.log("formData is ", formData);

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
};

export const { aiResponseMutation, generateTitleMutation } = aiResponseApi;
