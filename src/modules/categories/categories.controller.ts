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
  Patch,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Image } from '../images/schemas/images.schema';
import { CreateImageInCategoryDto } from './dto/create-image-in-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

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
    @Body() createImageInCategoryDto: CreateImageInCategoryDto,
  ): Promise<Image> {
    try {
      return await this.categoriesService.addImageToCategory(
        title,
        file,
        createImageInCategoryDto,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while adding image to category "${title}": ${error.message}`,
      );
    }
  }

  @Get(':title')
  async getCategoryByTitle(
    @Param('title') title: string,
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ): Promise<Category> {
    try {
      return await this.categoriesService.getCategoryByTitle(title, order);  
    } catch (error) {
      throw new NotFoundException(error.message);
    }
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

  @Patch(':title')
  async updateCategoryTitle(
    @Param('title') title: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategoryTitle(title, updateCategoryDto);
  }

  @Delete(':title/image/:imageId')
  async deleteImageFromCategory(
    @Param('title') title: string,
    @Param('imageId') imageId: string,
  ) {
    try {
      return await this.categoriesService.deleteImageFromCategory(
        title,
        imageId,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while removing image from category "${title}": ${error.message}`,
      );
    }
  }

  @Delete(':title')
  async deleteCategory(@Param('title') title: string) {
    return await this.categoriesService.deleteCategory(title);
  }
}
