import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ImagesService } from '../images/images.service';
import { Image, ImageDocument } from '../images/schemas/images.schema';
import { CreateImageDto } from '../images/dto/create-image.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private imagesService: ImagesService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const newCategory = new this.categoryModel({
      title: createCategoryDto.title,
      images: [],
    });
    return await newCategory.save();
  }

  async addImageToCategory(
    title: string,
    file: Express.Multer.File,
    createImageDto: CreateImageDto,
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({ title }).exec();
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }

    const modifiedCreateImageDto = { ...createImageDto, section: 'gallery' };

    const newImage = (await this.imagesService.createImage(
      file,
      modifiedCreateImageDto,
    )) as ImageDocument;

    category.images.push(newImage._id);
    return await category.save();
  }

  async getCategoryByTitle(title: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ title })
      .populate({
        path: 'images',
        model: 'Image',
      })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }
    return category;
  }

  async getThreeImages(title: string): Promise<Image[]> {
    const category = await this.categoryModel
      .findOne({ title })
      .populate('images')
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }

    const images = category.images.sort(() => Math.random() - 0.5).slice(0, 3);
    const imageIds = (images as ImageDocument[]).map((image) => image._id);

    return await this.imagesService.findAll({ _id: { $in: imageIds } });
  }

  async removeImageFromCategory(
    title: string,
    imageId: string,
  ): Promise<Category> {
    const category = await this.categoryModel.findOne({ title }).exec();
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }

    const imageIndex = category.images.findIndex(
      (image) => image.toString() === imageId,
    );
    if (imageIndex === -1) {
      throw new NotFoundException(
        `Image with ID "${imageId}" not found in this category`,
      );
    }

    await this.imagesService.deleteImage(imageId);

    category.images.splice(imageIndex, 1);

    return await category.save();
  }
}
