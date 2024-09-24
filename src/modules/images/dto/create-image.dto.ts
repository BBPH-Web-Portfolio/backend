import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  section: string;

  @IsNotEmpty()
  @IsString()
  subsection: string;

  @IsNotEmpty()
  @IsString()
  alt: string;

  @IsOptional()
  @IsString()
  link: string;
}