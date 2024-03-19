import { OpenaiService } from '@/openai/openai.service';
import { PuppeteerService } from '@/puppeteer/puppeteer.service';
import { Injectable } from '@nestjs/common';
// import fs from 'node:fs/promises';
// import path from 'path';

import { type ChatCompletionMessageParam } from 'openai/resources';

interface ConverstationData {
  postTitle: string;
  imageDescription?: string;
  subredditName: string;
  comments: Array<string>;
}

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

    // console.log('title is ', title);

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

  generatePrompts(data: ConverstationData) {
    const { postTitle, imageDescription, subredditName, comments } = data;

    let narrative = `Post Title: "${postTitle}"\n`;
    narrative += imageDescription
      ? `Image Description: "${imageDescription}"\n`
      : '';

    narrative += `Subreddit: r/${subredditName}\nConversation:\n`;

    comments.forEach((comment, index) => {
      if (index % 2 === 0) {
        narrative += `User: "${comment}"\n`;
      } else {
        narrative += `Post owner replies: "${comment}\n`;
      }
    });

    const promptBase =
      `Given the context of a post titled "${postTitle}" in subreddit r/${subredditName},` +
      `${imageDescription ? ` with the image described as "${imageDescription}",` : ''}` +
      ' and the following conversation:\n' +
      narrative +
      'Craft a thoughtful response to continue the conversation, particularly addressing the most recent comment.';

    const systemPrompt = promptBase;

    const userPrompt =
      `Imagine you've posted "${postTitle}" in subreddit r/${subredditName}` +
      `${imageDescription ? ` with an image described as "${imageDescription}".` : '.'}` +
      ' The following conversation has unfolded:\n' +
      narrative +
      "It's your turn to contribute. Write a reply that effectively continues the engagement with the latest comment, maintaining the context and flow of the discussion.";

    return {
      systemPrompt,
      userPrompt,
    };
  }

  urlOperation(url: string) {
    const subreddit = url.match(/\/r\/(\w+)/)[1];
    const commentId = url.match(/\/([^\/]+)\/?$/)[1];

    const postUrl = url.replace(/\/[^\/]+\/?$/, '/');
    const postId = postUrl.match(/comments\/([^\/]+)\//)[1];

    return {
      subreddit,
      commentId,
      postUrl,
      postId,
    };
  }

  async getAIResponse(dto: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { base64Image, ...restdto } = dto;
    // console.log('resDto is ', restdto);

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
        const { page } = await this.puppeteerService.launch({
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
        const { page } = await this.puppeteerService.launch({
          headless: false,
        });

        const commentUrl = dto.url;
        const { postUrl } = this.urlOperation(dto.url);

        await page.goto(postUrl, {
          waitUntil: 'networkidle2',
        });

        await this.puppeteerService.timer(3000);

        const { title, imageUrl } = await this.getTitleImage();

        console.log('title and image url is ', title, imageUrl);

        await page.goto(commentUrl, {
          waitUntil: 'networkidle2',
        });

        await this.puppeteerService.timer(3000);

        const commentText = await this.puppeteerService.getData({
          selector: {
            text: '#thing_t1_kva1k01 div.entry div.md > p',
            type: 'text',
          },
        });

        console.log('comment text is ', commentText);

        await this.puppeteerService.close();
      } else if (dto.commentType === 'followupCommentReply') {
        const { page } = await this.puppeteerService.launch({
          headless: true,
        });

        const { url: commentUrl } = dto;

        const { commentId, postUrl, postId, subreddit } =
          this.urlOperation(commentUrl);

        await page.goto(postUrl, {
          waitUntil: 'networkidle2',
        });

        await this.puppeteerService.timer(3000);

        const { title, imageUrl } = await this.getTitleImage();

        console.log('title and image url is ', title, imageUrl);

        await this.puppeteerService.timer(2000);

        console.log("now collecting followup comment's parent comment...");

        const comments = await page.evaluate(
          ({ commentId, postId }) => {
            const replyCommentId = `thing_t1_${commentId}`; // Example ID, adjust as necessary
            const replyComment = document.getElementById(replyCommentId);

            const siteTableId = `siteTable_t3_${postId}`;
            let comments = [];
            let currentElement = replyComment;

            while (currentElement && currentElement.id !== siteTableId) {
              if (
                (currentElement as HTMLElement).className.includes('listing') ||
                (currentElement as HTMLElement).className.includes('child')
              ) {
                currentElement = currentElement.parentNode as HTMLElement;
                continue;
              }

              comments.push(
                currentElement.querySelector<HTMLElement>('div.entry div.md')
                  ?.innerText,
              );

              currentElement = currentElement.parentNode as HTMLElement;

              // If you reach the "body" or "html" element, you can stop, or adjust the condition as needed
              if (
                (currentElement as HTMLElement).tagName === 'BODY' ||
                (currentElement as HTMLElement).tagName === 'HTML'
              ) {
                break;
              }

              if (
                (currentElement as HTMLElement).id === `siteTable_t3_${postId}`
              ) {
                break;
              }
            }
            comments = [...new Set(comments)].reverse();

            return comments;
          },
          { commentId, postId },
        );

        console.log('comments are ', JSON.stringify(comments));

        await this.puppeteerService.close();

        const conversationData = {
          postTitle: title,
          subredditName: subreddit,
          comments: comments,
        };

        const { systemPrompt, userPrompt } =
          this.generatePrompts(conversationData);

        // console.log('System Prompt:\n', systemPrompt);
        // console.log('\nUser Prompt:\n', userPrompt);

        const response = await this.openaiService.getChatCompletions({
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                    detail: 'high',
                  },
                },
                {
                  type: 'text',
                  text: userPrompt,
                },
              ],
            },
          ],
          model: 'gpt-4-vision-preview',
          max_tokens: 2000,
        });

        return {
          ...response,
          msg: 'Suggested followup comment',
        };

        console.log('response is ', response);
      }
    }
  }
}
