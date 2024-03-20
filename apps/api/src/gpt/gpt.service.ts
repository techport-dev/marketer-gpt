import { OpenaiService } from '@/openai/openai.service';
import { PuppeteerService } from '@/puppeteer/puppeteer.service';
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

  generateFollowupPrompts(data: ConverstationData) {
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
