import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Languages } from 'src/constants/constants';

export class CreateTextDto {
  @IsEnum(Languages)
  @IsNotEmpty()
  language: Languages;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  subsection: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  max_length_title?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  max_length_body?: number;
}
