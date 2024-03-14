import { OpenaiService } from '@/openai/openai.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GptService {
  constructor(private readonly openaiService: OpenaiService) {}

  async getAIResponse(dto: any) {
    // console.log('dto is ', dto);

    const latestData = dto[dto.length - 1];

    const REDDIT_TITLE_GENERATION_SYSTEM_PROMPT = `
    You are an AI designed to craft engaging Reddit titles for marketing purposes. Your input may include an image, a text message, or both, and you will be given a target subreddit. Your title generation should adhere to the following guidelines:
    - Capture the essence: The title must reflect the main idea or emotion conveyed by the input(s).
    - Be subreddit-specific: Tailor the title to fit the culture and interests of the target subreddit's audience.
    - Engage the audience: Make the title catchy and compelling to encourage clicks and interaction.
    - Reflect sentiment: The title should mirror the tone and sentiment of the message or image.
    
    The ultimate goal is to generate titles that maximize engagement and relevance within the specified subreddit community, utilizing a human-like approach in crafting titles based on the provided image or text content.
    `;

    const prompts = dto.map((item: any) => {
      if (item.generationType === 'Title') {
        if (item.titleType === 'imageText') {
          return {
            role: item.role,
            content: [
              {
                type: 'text',
                text: item.imageDescription,
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
