import { Module } from '@nestjs/common';
import { TextsService } from './texts.service';
import { TextsController } from './texts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Text, TextSchema } from './schemas/texts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Text.name, schema: TextSchema }]),
  ],
  controllers: [TextsController],
  providers: [TextsService],
})
export class TextsModule {}
