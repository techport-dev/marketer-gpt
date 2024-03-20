import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';
import { OpenAiModule } from '@/openai/openai.module';
import { PuppeteerService } from '@/puppeteer/puppeteer.service';
import { UtilsModule } from '@/utils/utils.module';

@Module({
  imports: [OpenAiModule, UtilsModule],
  controllers: [GptController],
  providers: [GptService, PuppeteerService],
})
export default class GptModule {}
