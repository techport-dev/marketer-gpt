import { Injectable } from '@nestjs/common';

@Injectable()
export class GptService {
  async generateTitle(dto: any) {
    console.log('dto is ', dto);
    return 'Hello World';
  }
}
