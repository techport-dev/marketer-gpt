import { OpenaiService } from '@/openai/openai.service';
import { PuppeteerService } from '@/puppeteer/puppeteer.service';
import { SharpService } from '@/utils/services/sharp.service';
import { Injectable } from '@nestjs/common';
import { type ChatCompletionMessageParam } from 'openai/resources';

interface ConverstationData {
  postTitle: string;
  imageDescription?: string;
  subredditName: string;
  comments: Array<string>;
}

interface CommentReplyPromptsParams {
  postTitle: string;
  imageDescription?: string;
  subredditName: string;
  userComment: string;
}

interface PostTitlePromptsParams {
  subredditName: string;
  avoidenceKeywords: string;
  lengthLimit: string;
  imageDescription: string;
}

@Injectable()
export class GptService {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly puppeteerService: PuppeteerService,
    private readonly sharpService: SharpService,
  ) {}

  async getTitleImage() {
    const title = await this.puppeteerService.getData({
      selector: {
        text: 'p.title > a',
        type: 'text',
      },
    });

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

  generatePostTitlePrompts(data: PostTitlePromptsParams) {
    const { subredditName, avoidenceKeywords, lengthLimit, imageDescription } =
      data;

    const systemPrompt = `
      As an AI simulating a social media marketing expert for the Reddit community, you are tasked with creating titles for a product post in "r/${subredditName}". ${imageDescription ? `The post will include an image described as "${imageDescription}".` : 'The post may include an image.'} Your goal is to generate creative and engaging titles based on the content provided, which may include text, image, or both. Follow these guidelines:
      
      - Generate ${lengthLimit} unique titles that resonate with "r/${subredditName}" community culture, capturing the essence and emotion of the content.
      - Each title should spark curiosity and engagement, reflecting the content's sentiment (e.g., irony, sarcasm, wholesomeness).
      - Avoid using ${avoidenceKeywords}, and refrain from directly promoting commercial products. Focus on authenticity and relevance to the content.
      - Titles must be under 100 characters to remain concise and impactful, adhering to Reddit's title length preferences.
      - Maintain a professional, yet community-friendly tone, avoiding emojis, hashtags, and unnecessary embellishments.
      - Use insights from any provided image or post context to ensure each title is relevant and compelling.
      
      Your objective is to create titles that attract attention and encourage clicks and interaction, showcasing a marketer's ability to communicate concisely and effectively.
      `.trim();

    const userPrompt = `
     Generate post title for the following content
    `;

    return {
      systemPrompt,
      userPrompt,
    };
  }

  generatePostReplyPrompts(data: any) {
    const { postTitle, imageDescription, subredditName } = data;

    const systemPrompt = `
    You come across a post titled "${postTitle}" in the subreddit "r/${subredditName}", showcasing an innovative product with an engaging image. ${imageDescription ? `imagedescription is ${imageDescription}` : ''} As a real Reddit user who's impressed by the product and wants to support it, you decide to leave a comment.

    Generate a post reply with the following focus:
    - Expresses your genuine interest or enthusiasm for the product based on the post's content.
    - Highlights a specific feature or benefit that caught your eye, without delving into deep analysis.
    - Encourages other users to consider the product, using persuasive yet subtle language.
    - Remains concise, aiming for a quick read to leave a lasting, positive impression.
    - ensuring it remains under 40 words to maintain clarity and focus.
    - Avoids the use of emojis and hashtags to maintain a straightforward and professional tone.

    Your comment should naturally attract attention to the product, persuading others to take a closer look, with the goal of fostering interest and potential purchases among the community.
  `.trim();

    const userPrompt = `
    Generate a post reply comment to the following Reddit post
    `;

    return { systemPrompt, userPrompt };
  }

  generateCommentReplyPrompts(data: CommentReplyPromptsParams) {
    const { postTitle, imageDescription, subredditName, userComment } = data;

    const systemPrompt = `
    You are an AI, acting as a Reddit social media marketing expert. You've posted a product titled "${postTitle}" in the subreddit "r/${subredditName}", and included an image relevant to the post. A user has left a comment: "${userComment}".
    ${imageDescription ? `The accompanying image is described as "${imageDescription}".` : ''}

    Generate a reply with the following focus:
    - Address the user's comment directly, providing a concise answer or information that adds value.
    - Keep the reply brief and informative, ensuring it remains under 40 words to maintain clarity and focus.
    - Use insights from the image and the post context to tailor your response, ensuring it is relevant and engaging.
    - Maintain a professional tone throughout, avoiding emojis, hashtags, or any other form of embellishment. 

    Your goal is to encourage further interaction in a manner that’s succinct and on-point, reflective of a marketer’s concise communication style.

    Reply concisely.
    `;

    const userPrompt = `
    Generate a reply comment to the following Reddit comment
    `;

    return { systemPrompt, userPrompt };
  }

  generateFollowupPrompts(data: ConverstationData) {
    const { postTitle, imageDescription, subredditName, comments } = data;

    let narrative = '';
    comments.forEach((comment, index) => {
      narrative +=
        index % 2 === 0 ? `User1: "${comment}"\n` : `User2: "${comment}"\n`;
    });

    const systemPrompt = `
        As an AI modeled after a Reddit social media marketing expert, you've successfully engaged users with a post titled "${postTitle}" in "r/${subredditName}". The post features a product, accompanied by an image${imageDescription ? `, described as "${imageDescription}"` : ''}. The ongoing conversation has been captured below:

        ${narrative}

        Your next task is to craft a follow-up comment that further engages the audience. This comment should:
        - Continue the dialogue in a manner that feels natural and human-like, as if coming from a real person.
        - Keep the response professional, concise, and informative, ensuring it does not exceed 40 words to maintain the reader's attention.
        - Steer clear of emojis, hashtags, and other embellishments, focusing on clear communication.
        - Draw on details from the post's image and context to create a reply that is both relevant and compelling, aimed at fostering further interaction.

        The objective is to subtly prompt continued conversation, maintaining a tone and approach that reflect a marketer's knack for engaging communication without overt selling.
        `.trim();

    const userPrompt = `
    Generate follow up reply comment to the following Reddit post
    `;

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

  async titleGenerate(dto: any, file: Express.Multer.File) {
    // let base64Image = '';

    // console.log('file mimetype if ', file.mimetype);

    // if (file.mimetype === 'image/webp') {
    //   base64Image = file.buffer.toString('base64');
    // } else {
    const resizeImage = await this.sharpService.resizeImage({
      file: file.buffer,
      format: 'png',
      quality: 80,
      resizeWidth: 500,
    });

    const base64Image = resizeImage.toString('base64');

    const { systemPrompt, userPrompt } = this.generatePostTitlePrompts(dto);

    const prompts: Array<ChatCompletionMessageParam> = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    if (dto.titleType === 'imageText') {
      prompts.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
              detail: 'high',
            },
          },
        ],
      });
    } else if (dto.titleType === 'image') {
      prompts.push({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Image}`,
              detail: 'high',
            },
          },
        ],
      });
    } else if (dto.titleType === 'text') {
      prompts.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: dto.imageDescription,
          },
        ],
      });
    }

    const response = await this.openaiService.getChatCompletions({
      messages: prompts,
      model: 'gpt-4-vision-preview',
      max_tokens: 1000,
    });

    return {
      ...response,
      msg: 'Suggested post title',
    };
  }

  async commentGenerate(dto: any) {
    const { commentType, url } = dto;
    if (commentType === 'postReply') {
      const { page } = await this.puppeteerService.launch({
        headless: true,
      });

      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      await this.puppeteerService.timer(2000);

      const { title, imageUrl } = await this.getTitleImage();
      console.log('title and image url is ', title, imageUrl);

      await this.puppeteerService.close();

      const { systemPrompt, userPrompt } = this.generatePostReplyPrompts(dto);

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
        max_tokens: 1000,
      });

      return {
        ...response,
        msg: 'Suggested postReply comment',
      };
    } else if (commentType === 'commentReply') {
      const { page } = await this.puppeteerService.launch({
        headless: true,
      });

      const commentUrl = dto.url;
      const { postUrl, commentId, subreddit } = this.urlOperation(commentUrl);

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
          text: `#thing_t1_${commentId} div.entry div.md`,
          type: 'text',
        },
      });

      console.log('comment text is ', commentText);

      await this.puppeteerService.close();

      const commentReplyData = {
        postTitle: title,
        imageDescription: '',
        subredditName: subreddit,
        userComment: commentText,
      };

      const { systemPrompt, userPrompt } =
        this.generateCommentReplyPrompts(commentReplyData);

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
        msg: 'Suggested commentReply comment',
      };
    } else if (commentType === 'followupCommentReply') {
      // start of followupCommentReply
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
        this.generateFollowupPrompts(conversationData);

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
    }
  }

  async getAIResponse(dto: any, file: Express.Multer.File) {
    console.log('file is ', file);
    console.log('dto is ', dto);

    const { base64Image, ...restdto } = dto;

    if (dto.generationType === 'Title') {
      const { systemPrompt, userPrompt } =
        this.generatePostTitlePrompts(restdto);

      const prompts: Array<ChatCompletionMessageParam> = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      if (dto.titleType === 'imageText') {
        prompts.push({
          role: dto.role,
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
                detail: 'high',
              },
            },
          ],
        });
      } else if (dto.titleType === 'image') {
        prompts.push({
          role: dto.role,
          content: [
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
                detail: 'high',
              },
            },
          ],
        });
      } else if (dto.titleType === 'text') {
        prompts.push({
          role: dto.role,
          content: [
            {
              type: 'text',
              text: dto.imageDescription,
            },
          ],
        });
      }

      // prompts.unshift({
      //   role: 'system',
      //   content: REDDIT_TITLE_GENERATION_SYSTEM_PROMPT,
      // });

      console.log('generating title please wait...');

      const response = await this.openaiService.getChatCompletions({
        messages: prompts,
        model: 'gpt-4-vision-preview',
        max_tokens: 1000,
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
          headless: true,
        });

        const commentUrl = dto.url;
        const { postUrl, commentId, subreddit } = this.urlOperation(commentUrl);

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
            text: `#thing_t1_${commentId} div.entry div.md`,
            type: 'text',
          },
        });

        console.log('comment text is ', commentText);

        await this.puppeteerService.close();

        const commentReplyData = {
          postTitle: title,
          imageDescription: '',
          subredditName: subreddit,
          userComment: commentText,
        };

        const { systemPrompt, userPrompt } =
          this.generateCommentReplyPrompts(commentReplyData);

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
          msg: 'Suggested commentReply comment',
        };

        // end of commentReply
      } else if (dto.commentType === 'followupCommentReply') {
        // start of followupCommentReply
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
          this.generateFollowupPrompts(conversationData);

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
