import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

type IResizeImageParams = {
  file: Buffer;
  resizeWidth?: number;
  quality?: number;
  format: keyof sharp.FormatEnum | sharp.AvailableFormatInfo;
};

@Injectable()
export class SharpService {
  async resizeImage({
    file,
    resizeWidth = 500,
    quality = 80,
    format = 'png',
  }: IResizeImageParams) {
    const buffer = await sharp(file)
      .resize({
        width: resizeWidth,
      })
      .toFormat(format)
      .png({ quality })
      .toBuffer();

    return buffer;
  }
}
