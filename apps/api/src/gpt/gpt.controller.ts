import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('aiResponse')
  async aiResponse(@Body() dto: any) {
    return this.gptService.getAIResponse(dto);
  }
}
