import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Image, ImageDocument } from './schemas/images.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { CloudinaryService } from './cloudinary.service';
import { envs } from 'src/config/envs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createImage(
    file: Express.Multer.File,
    createImageDto: CreateImageDto,
  ): Promise<Image> {
    const { section, subsection, alt, link } = createImageDto;

    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    if (file.size > envs.maxFileSize) {
    throw new BadRequestException('File size exceeds the limit');
  }

    let uploadResult;
    try {
      uploadResult = await this.cloudinaryService.uploadImageToCloudinary(file);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload image to Cloudinary',
      );
    }

    const newImage = new this.imageModel({
      url: uploadResult.secure_url,
      cloudinary_public_id: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      section,
      subsection,
      alt,
      link,
    });

    return await newImage.save();
  }

  async findOne(imageId: string): Promise<Image> {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }
    return image;
  }

  async findImagesBySection(section: string): Promise<Image[]> {
    return await this.imageModel.find({ section }).exec();
  }

  async findAll(filter: FilterQuery<ImageDocument> = {}): Promise<Image[]> {
    return await this.imageModel.find(filter);
  }

  async updateImage(imageId: string, file?: Express.Multer.File, updateImageDto?: UpdateImageDto): Promise<Image> {
    const { section, subsection, alt, width, height, link } = updateImageDto || {};

    const existingImage = await this.imageModel.findById(imageId);
    if (!existingImage)
      throw new NotFoundException(`Image with ID ${imageId} not found`);

    if (file) {
      if ((existingImage.width && existingImage.height) && (width != 0 && height != 0)) {
        const { width: fileWidth, height: fileHeight } =
          await this.cloudinaryService.getImageDimensions(file);
        if (
          fileWidth != existingImage.width ||
          fileHeight != existingImage.height
        ) {
          throw new BadRequestException(
            'New image dimensions do not match the required size',
          );
        }
      }

      let uploadResult;
      try {
        uploadResult =
          await this.cloudinaryService.uploadImageToCloudinary(file);
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to upload new image to Cloudinary',
        );
      }

      if (uploadResult && uploadResult.url) {
        try {
          await this.cloudinaryService.deleteImageFromCloudinary(
            existingImage.cloudinary_public_id,
          );
        } catch (error) {
          console.error('Failed to delete old image from Cloudinary:', error);
        }

        existingImage.url = uploadResult.secure_url;
        existingImage.cloudinary_public_id = uploadResult.public_id;
        existingImage.width = uploadResult.width;
        existingImage.height = uploadResult.height;
      } else {
        throw new InternalServerErrorException(
          'Upload result from Cloudinary is invalid',
        );
      }
    } else {
        if (width !== undefined) existingImage.width = width;
        if (height !== undefined) existingImage.height = height;
    }

    if (section !== undefined) existingImage.section = section;
    if (subsection !== undefined) existingImage.subsection = subsection;
    if (alt !== undefined) existingImage.alt = alt;
    if (link !== undefined) existingImage.link = link;

    return await existingImage.save();
  }

  async deleteImage(imageId: string): Promise<Image> {
    const image = await this.imageModel.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    try {
      await this.cloudinaryService.deleteImageFromCloudinary(
        image.cloudinary_public_id,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete image from Cloudinary',
      );
    }

    return await this.imageModel.findByIdAndDelete(imageId);
  }
}
