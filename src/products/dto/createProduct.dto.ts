import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductType {
  Fertilizer = 'Fertilizer',
  Seed = 'Seed',
}

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product type is required.' })
  @IsString({ message: 'Product type must be a string.' })
  @IsEnum(ProductType, {
    message: 'Product type must be either Fertilizer or Seed.',
  })
  type: string;

  @IsString({ message: 'Product name must be a valid string' })
  @IsNotEmpty({ message: 'Product name is required' })
  product_name: string;

  @IsArray()
  @IsOptional()
  @Type(() => String)
  compatibleWith: string[]; // Array of product IDs

  @IsNumber()
  @IsOptional()
  maximumQuantityPerAcre: number;
}
