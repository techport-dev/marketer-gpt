import { OpenaiService } from '@/openai/openai.service';
import { PuppeteerService } from '@/puppeteer/puppeteer.service';
import { Injectable } from '@nestjs/common';
// import fs from 'node:fs/promises';
// import path from 'path';
import { type ChatCompletionMessageParam } from 'openai/resources';

@Injectable()
export class GptService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly puppeteerService: PuppeteerService,
  ) {}

  async getTitleImage() {
    const title = await this.puppeteerService.getData({
      selector: {
        text: 'p.title > a',
        type: 'text',
      },
    });

    console.log('title is ', title);

    const imageUrl = await this.puppeteerService.getData({
      selector: {
        text: 'img.preview',
        type: 'image',
      },
    });

    return {
      title,
      imageUrl,
    };
  }

  async getAIResponse(dto: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { base64Image, ...restdto } = dto;
    console.log('resDto is ', restdto);

    if (dto.generationType === 'Title') {
      const REDDIT_TITLE_GENERATION_SYSTEM_PROMPT = `
      Imagine you're an active member of the r/${dto.subreddit} community, deeply familiar with its humor, trends, and what resonates with its audience. Your task is to create engaging and creative Reddit titles based on provided content, which could be an image, text, or both. Follow these guidelines:
      - The title should capture the essence and emotion of the content, fitting seamlessly into r/${dto.subreddit}'s culture.
      - Tailor the title to engage the community, encouraging clicks and interaction, while reflecting the content's sentiment—be it irony, sarcasm, or wholesomeness.
      - Avoid using words related to ${dto.avoidenceKeywords} or any commercial products, focusing instead on authenticity and relevance.
      Create ${dto.lengthLimit} distinct titles, aiming for a tone that seems natural and human-crafted, as if by a subreddit enthusiast.`;

      let prompts: Array<ChatCompletionMessageParam> = [];

      if (dto.titleType === 'imageText') {
        prompts = [
          {
            role: dto.role,
            content: [
              {
                type: 'text',
                text: `Description: ${dto.imageDescription}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: dto.base64Image,
                  detail: 'high',
                },
              },
            ],
          },
        ];
      } else if (dto.titleType === 'image') {
        prompts = [
          {
            role: dto.role,
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: dto.base64Image,
                  detail: 'high',
                },
              },
            ],
          },
        ];
      } else if (dto.titleType === 'text') {
        prompts = [
          {
            role: dto.role,
            content: [
              {
                type: 'text',
                text: dto.imageDescription,
              },
            ],
          },
        ];
      }

      console.log('system propmts is ', REDDIT_TITLE_GENERATION_SYSTEM_PROMPT);

      prompts.unshift({
        role: 'system',
        content: REDDIT_TITLE_GENERATION_SYSTEM_PROMPT,
      });

      console.log('generating title please wait...');

      const response = await this.openaiService.getChatCompletions({
        messages: prompts,
        model: 'gpt-4-vision-preview',
        max_tokens: 2000,
      });

      console.log('response is ', response);

      return response;
    } else {
      console.log('else dto generation type is ', dto);
      if (dto.commentType === 'postReply') {
        const { browser, page } = await this.puppeteerService.launch({
          headless: false,
        });

        await page.goto(dto.url, {
          waitUntil: 'networkidle2',
        });

        await this.puppeteerService.timer(4000);

        const { title, imageUrl } = await this.getTitleImage();

        console.log('title and image url is ', title, imageUrl);

        await this.puppeteerService.close();

        console.log('waiting generating image response...');

        // const response = await this.openaiService.getChatCompletions({
        //   messages: [
        //     {
        //       role: 'user',
        //       content: [
        //         {
        //           type: 'text',
        //           text: "what's this image?",
        //         },
        //         {
        //           type: 'image_url',
        //           image_url: {
        //             url: imageUrl,
        //             detail: 'high',
        //           },
        //         },
        //       ],
        //     },
        //   ],
        //   model: 'gpt-4-vision-preview',
        //   max_tokens: 2000,
        // });

        // console.log('GPT image response is ', response);
      } else if (dto.commentType === 'commentReply') {
        // const { title, imageUrl } = await this.getTitleImage();
        // console.log('title and image url is ', title, imageUrl);
      }
    }
  }
}
