import { OpenaiService } from '@/openai/openai.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GptService {
  constructor(private readonly openaiService: OpenaiService) {}

  async getAIResponse(dto: any) {
    // console.log('dto is ', dto);

    const latestData = dto[dto.length - 1];

    const REDDIT_TITLE_GENERATION_SYSTEM_PROMPT = `
      You are an AI tasked with creating engaging Reddit titles specifically for the r/${latestData.subreddit} subreddit, based on an image, a text message, or both. When generating titles, adhere to the following refined guidelines:
      - Essence Capture: Your title should succinctly convey the main idea or emotion of the input(s), ensuring it resonates with the humor and trends prevalent in meme culture.
      - Subreddit Specificity: The titles must be tailored specifically for the r/${latestData.subreddit} audience, reflecting an understanding of meme culture and what currently engages this community.
      - Audience Engagement: Construct titles that are not only catchy and humorous but also encourage clicks and interactions, driving engagement within r/${latestData.subreddit}.
      - Sentiment Reflection: Ensure the tone of the title matches the sentiment of the meme, whether it's ironic, sarcastic, wholesome, etc.
      - Exclusion Criteria: Avoid including words related to commercial products like ${latestData.avoidenceKeywords} or similar merchandise in the titles to maintain authenticity and relevance to the subreddit's non-commercial focus.

      Generate at least ${latestData.lengthLimit} distinct and creative titles for each request, with the goal of maximizing engagement and relevance within the r/meme community. Your approach should mirror human creativity and adaptability, crafting titles that fit seamlessly into the subreddit's culture and avoid overt commercialization.`;

    const prompts = dto.map((item: any) => {
      if (item.generationType === 'Title') {
        if (item.titleType === 'imageText') {
          return {
            role: item.role,
            content: [
              {
                type: 'text',
                text: `The image description is ${item.imageDescription}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: item.base64Image,
                  detail: 'high',
                },
              },
            ],
          };
        } else if (item.titleType === 'image') {
          return {
            role: item.role,
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: item.base64Image,
                  detail: 'high',
                },
              },
            ],
          };
        } else if (item.titleType === 'text') {
          return {
            role: item.role,
            content: [
              {
                type: 'text',
                text: item.imageDescription,
              },
            ],
          };
        }
      }
      return {};
    }) as Array<any>;

    prompts.unshift({
      role: 'system',
      content: REDDIT_TITLE_GENERATION_SYSTEM_PROMPT,
    });

    console.log('ai generating response using the propmts');

    const response = await this.openaiService.getChatCompletions({
      messages: prompts,
      model: 'gpt-4-vision-preview',
      max_tokens: 2000,
    });

    console.log('ai response is ', response);

    return response;

    // console.log('prompts is ', prompts);
  }
}
