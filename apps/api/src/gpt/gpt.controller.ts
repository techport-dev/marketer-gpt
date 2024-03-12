import { Body, Controller, Post } from '@nestjs/common';

@Controller('gpt')
export class GptController {
  constructor() {}

  @Post('aiResponse')
  async aiResponse(@Body() dto: any) {
    console.log('body dto is ', dto);
    return 'Hello World';
  }
}
