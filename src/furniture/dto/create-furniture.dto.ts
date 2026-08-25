import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { FurnitureCategory } from '@prisma/client';

export class CreateFurnitureDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsString()
  @IsNotEmpty()
  dimensions!: string;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsEnum(FurnitureCategory)
  category!: FurnitureCategory;
}
