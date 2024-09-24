import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { TextsModule } from './modules/texts/texts.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [MongooseModule.forRoot(envs.databaseUrl), AuthModule, TextsModule, ImagesModule],
})
export class AppModule {}
