import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { type ChatCompletionMessageParam } from 'openai/resources';
import { type Stream } from 'openai/streaming';

type OpenAIModel =
  | (string & object)
  | 'gpt-4-0125-preview'
  | 'gpt-4-turbo-preview'
  | 'gpt-4-1106-preview'
  | 'gpt-4-vision-preview'
  | 'gpt-4'
  | 'gpt-4-0314'
  | 'gpt-4-0613'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'
  | 'gpt-4-32k-0613'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-3.5-turbo-0301'
  | 'gpt-3.5-turbo-0613'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo-16k-0613';

type GetChatCompletionsParamsType = {
  messages: Array<ChatCompletionMessageParam>;
  model: OpenAIModel;
  max_tokens?: number;
  stream?: boolean;
};

@Injectable()
export class OpenaiService {
  private readonly openai = new OpenAI({
    apiKey: this.configService.getOrThrow('OPENAI_API_KEY'),
  });

  constructor(private readonly configService: ConfigService) {}

  async getChatCompletions({
    messages,
    model,
    max_tokens = 2000,
    stream = false,
  }: GetChatCompletionsParamsType) {
    const response = await this.openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: max_tokens,
      stream: stream,
    });

    if (!stream) {
      return (response as OpenAI.Chat.Completions.ChatCompletion).choices[0]
        .message;
    }

    return response as Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;
  }
}
