import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';
import { OpenAiModule } from '@/openai/openai.module';
import { PuppeteerService } from '@/puppeteer/puppeteer.service';

@Module({
  imports: [OpenAiModule],
  controllers: [GptController],
  providers: [GptService, PuppeteerService],
})
export default class GptModule {}
