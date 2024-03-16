import { Module } from '@nestjs/common';
import GptModule from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { AllExceptionsFilter } from './shared/all-exceptions.filter';

const APP_FILTER = 'APP_FILTER';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV}`,
    }),
    GptModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
