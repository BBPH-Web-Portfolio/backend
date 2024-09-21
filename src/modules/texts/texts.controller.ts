import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TextsService } from './texts.service';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { ParseObjectIdPipe } from 'src/utils/parse-object-id-pipe.pipe';

@Controller('texts')
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @Post()
  create(@Body() createTextDto: CreateTextDto) {
    return this.textsService.create(createTextDto);
  }

  @Get()
  findAll() {
    return this.textsService.findAll();
  }

  @Get('by-id/:id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.textsService.findOne(id);
  }

  @Get('by-section/:section')
  findOneBySection(@Param('section') section: string) {
    return this.textsService.findOneBySection(section);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTextDto: UpdateTextDto,
  ) {
    return this.textsService.update(id, updateTextDto);
  }
}
