import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  ValidateNested,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';

class ProductOrder {
  @IsMongoId({ message: 'Product ID must be a valid MongoDB ObjectId' })
  product: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export enum orderStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export class CreateOrderDto {
  @IsMongoId({ message: 'Farmer ID must be a valid MongoDB ObjectId' })
  farmerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrder)
  productDetails: ProductOrder[];

  @IsNumber({}, { message: 'Land size must be a number' })
  landSize: number; // This represents the total land size for the order context

  @IsString({ message: 'Product name must be a valid string' })
  @IsEnum(orderStatus, {
    message: 'Order status must be either Approved, Pending, or Rejected.',
  })
  status: orderStatus = orderStatus.Pending;
}
