import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ImagesService } from '../images/images.service';
import { Image, ImageDocument } from '../images/schemas/images.schema';
import { CreateImageInCategoryDto } from './dto/create-image-in-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Order } from 'src/constants/constants';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
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
    createImageInCategoryDto: CreateImageInCategoryDto,
  ): Promise<Image> {
    const category = await this.categoryModel.findOne({ title }).exec();
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }

    const modifiedCreateImageDto = {
      ...createImageInCategoryDto,
      section: 'gallery',
      subsection: title,
    };

    const newImage: any = await this.imagesService.createImage(
      file,
      modifiedCreateImageDto,
    );

    category.images.push(newImage._id);
    await category.save();
    return newImage;
  }

  async getCategoryByTitle(title: string, order: Order): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ title })
      .populate({
        path: 'images',
        options: { sort: { updatedAt: order === Order.ASC ? 1 : -1 } },
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
    const imageIds = (images as unknown as ImageDocument[]).map(
      (image) => image._id,
    );

    return await this.imagesService.findAll({ _id: { $in: imageIds } });
  }

  async updateCategoryTitle(
    oldTitle: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ title: oldTitle })
      .exec();
    if (!category) {
      throw new NotFoundException(
        `Category with title "${oldTitle}" not found`,
      );
    }

    category.title = updateCategoryDto.title;

    await this.imageModel.updateMany(
      { _id: { $in: category.images } },
      { subsection: updateCategoryDto.title },
    );
    await category.save();

    const updatedCategory = await this.categoryModel
    .findOne({ title: updateCategoryDto.title })
    .populate('images')
    .exec();
    return updatedCategory
  }

  async deleteImageFromCategory(title: string, imageId: string) {
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

    const result = await this.imagesService.deleteImage(imageId);
    category.images.splice(imageIndex, 1);
    await category.save();
    return result;
  }

  async deleteCategory(
    title: string,
  ): Promise<{ deletedId: string; message: string }> {
    const category = await this.categoryModel.findOne({ title }).exec();
    if (!category) {
      throw new NotFoundException(`Category with title "${title}" not found`);
    }
    await this.imageModel.deleteMany({ subsection: title }).exec();
    await this.categoryModel.deleteOne({ title }).exec();
    return {
      deletedId: category._id.toString(),
      message: 'Category and all associated images deleted successfully',
    };
  }
}
