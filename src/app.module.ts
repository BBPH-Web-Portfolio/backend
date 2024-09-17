import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { TextsModule } from './modules/texts/texts.module';

@Module({
  imports: [MongooseModule.forRoot(envs.databaseUrl), AuthModule, TextsModule],
})
export class AppModule {}
