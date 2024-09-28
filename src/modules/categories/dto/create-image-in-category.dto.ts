import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageInCategoryDto {
  @IsNotEmpty()
  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  link: string;
}