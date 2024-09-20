import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/images.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File, createImageDto: CreateImageDto): Promise<Image> {
    const { category, alt } = createImageDto;

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    let uploadResult;
    try {
      uploadResult = await this.cloudinaryService.uploadImageToCloudinary(file);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to upload image to Cloudinary');
    }

    const newImage = new this.imageModel({
      url: uploadResult.url,
      cloudinaryPublicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      category,
      alt,
    });

    return await newImage.save();
  }

  async uploadAndReplaceImage(imageId: string, file: Express.Multer.File): Promise<Image> {
    const existingImage = await this.imageModel.findById(imageId);
    if (!existingImage) throw new NotFoundException('Image not found');

    if (existingImage.width && existingImage.height) {
      const { width, height } =
        await this.cloudinaryService.getImageDimensions(file);
      if (width > existingImage.width || height > existingImage.height) {
        throw new BadRequestException('New image dimensions exceed the allowed size');
      }
    }

    let uploadResult;
    try {
      uploadResult = await this.cloudinaryService.uploadImageToCloudinary(file);
    } catch (error) {
        console.log(error);
      throw new InternalServerErrorException('Failed to upload new image to Cloudinary');
    }

    if (uploadResult && uploadResult.url) {
      try {
        await this.cloudinaryService.deleteImageFromCloudinary(
          existingImage.cloudinaryPublicId,
        );
      } catch (error) {
        console.error('Failed to delete old image from Cloudinary:', error);
      }

      existingImage.url = uploadResult.secure_url;
      existingImage.cloudinaryPublicId = uploadResult.public_id;
      existingImage.width = uploadResult.width;
      existingImage.height = uploadResult.height;
      await existingImage.save();

      return existingImage;
    } else {
      throw new InternalServerErrorException('Upload result from Cloudinary is invalid');
    }
  }

  async findOne(imageId: string): Promise<Image> {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    return image;
  }

  async updateImage(imageId: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    const { category, alt, width, height } = updateImageDto;

    if (category) image.category = category;
    if (alt) image.alt = alt;
    if (width) image.width = width;
    if (height) image.height = height;

    return await image.save();
  }

  async deleteImage(imageId: string): Promise<Image> {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    try {
      await this.cloudinaryService.deleteImageFromCloudinary(image.cloudinaryPublicId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete image from Cloudinary');
    }

    return await this.imageModel.findByIdAndDelete(imageId);
  }
}
