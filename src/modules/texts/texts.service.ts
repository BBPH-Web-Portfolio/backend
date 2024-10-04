import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Text, TextDocument } from './schemas/texts.schema';
import { Model } from 'mongoose';

@Injectable()
export class TextsService {
  constructor(
    @InjectModel(Text.name)
    private readonly textModel: Model<TextDocument>,
  ) {}
  async create(createTextDto: CreateTextDto) {
    return await this.textModel.create(createTextDto);
  }

  async findAll() {
    return await this.textModel.find();
  }

  async findOne(id: string) {
    const text = await this.textModel.findById(id);
    if (!text) {
      throw new NotFoundException(`No se encontró el documento con ID ${id}`);
    }
    return text;
  }

  async findOneBySection(section: string) {
    const text = await this.textModel.findOne({ section });
    if (!text) {
      throw new NotFoundException(
        `No se encontró el documento con sección ${section}`,
      );
    }
    return text;
  }

  async update(id: string, updateTextDto: UpdateTextDto) {
    const result = await this.textModel.findOneAndUpdate(
      { _id: id },
      { $set: updateTextDto },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException(`No se encontró el documento con ID ${id}`);
    }

    return result;
  }
}
