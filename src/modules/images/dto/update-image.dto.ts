import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}