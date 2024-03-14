import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';
import { OpenAiModule } from '@/openai/openai.module';

@Module({
  imports: [OpenAiModule],
  controllers: [GptController],
  providers: [GptService],
})
export default class GptModule {}
