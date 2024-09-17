import { Injectable } from '@nestjs/common';
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
    return 'This action adds a new text';
  }

  async findAll() {
    return await this.textModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} text`;
  }

  update(id: number, updateTextDto: UpdateTextDto) {
    return `This action updates a #${id} text`;
  }

  remove(id: number) {
    return `This action removes a #${id} text`;
  }
}
