import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GptService } from './gpt.service';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileInterceptor } from '@nestjs/platform-express';

const multerOptions: MulterOptions = {
  fileFilter: (req, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          `Unsupported file type ${file.originalname}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @UseInterceptors(FileInterceptor('files', multerOptions))
  @Post('aiResponse/title')
  async aiResponse(
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.gptService.getAIResponse(dto, file);
  }

  // @Post('/comment/aiResponse')
  // async aiResponse(@Body() dto: any) {
  //   return this.gptService.getAIResponse(dto);
  // }
}
