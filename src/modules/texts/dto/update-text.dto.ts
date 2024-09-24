import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTextDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;
}
