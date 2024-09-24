import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsString()
  subsection?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  width?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  link?: string;
}