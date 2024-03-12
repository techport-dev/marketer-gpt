import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  imports: [],
  controllers: [GptController],
  providers: [GptService],
})
export default class GptModule {}
