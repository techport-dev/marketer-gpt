import { Module } from '@nestjs/common';
import { SharpService } from './services/sharp.service';

@Module({
  providers: [SharpService],
  exports: [SharpService],
})
export class UtilsModule {}
