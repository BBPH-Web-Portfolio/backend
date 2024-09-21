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
  title: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsNumber()
  @IsNotEmpty()
  max_length: number;
}
