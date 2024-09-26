import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateImageDto } from '../images/dto/create-image.dto';
import { Image } from '../images/schemas/images.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Post(':title/image')
  @UseInterceptors(FileInterceptor('file'))
  async addImageToCategory(
    @Param('title') title: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ) {
    try {
      return await this.categoriesService.addImageToCategory(title, file, createImageDto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while adding image to category "${title}": ${error.message}`,
      );
    }
  }

  @Get(':title')
  async getCategoryByTitle(@Param('title') title: string) {
    const category = await this.categoriesService.getCategoryByTitle(title);
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }
    return category;
  }

  @Get(':title/three-images')
  async getThreeImages(@Param('title') title: string): Promise<Image[]> {
    try {
      return await this.categoriesService.getThreeImages(title);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while retrieving images for category "${title}": ${error.message}`,
      );
    }
  }

  @Delete(':title/image/:imageId')
  async removeImageFromCategory(
    @Param('title') title: string,
    @Param('imageId') imageId: string,
  ) {
    try {
      return await this.categoriesService.removeImageFromCategory(title, imageId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while removing image from category "${title}": ${error.message}`,
      );
    }
  }
}
