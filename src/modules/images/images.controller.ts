import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImagesService } from './images.service';
import { Image } from './schemas/images.schema';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ): Promise<Image> {
    if (!file) {
      throw new NotFoundException('File is required');
    }
    return this.imagesService.uploadImage(file, createImageDto);
  }

  @Get()
  async findAll(): Promise<Image[]> {
    return this.imagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Image> {
    return this.imagesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() updateImageDto?: UpdateImageDto,
  ): Promise<Image> {
    return this.imagesService.updateImage(id, file, updateImageDto);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string): Promise<Image> {
    return this.imagesService.deleteImage(id);
  }
}
