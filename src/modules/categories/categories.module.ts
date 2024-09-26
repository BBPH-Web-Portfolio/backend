// categories.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Image, ImageSchema } from '../images/schemas/images.schema';
import { ImagesService } from '../images/images.service';
import { CloudinaryService } from '../images/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, ImagesService, CloudinaryService],
})
export class CategoriesModule {}
