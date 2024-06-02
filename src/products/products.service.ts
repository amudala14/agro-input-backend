import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { handleDatabaseOperation } from '../common/helpers/service-helper';
import { findWithPagination } from '../common/utils/pagination.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // Create product
  createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return handleDatabaseOperation(
      this.productModel.create(createProductDto),
      'Failed to create product',
      '',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Fetch all products with pagination
  async findAll(page: number, limit: number): Promise<Product[]> {
    return handleDatabaseOperation(
      findWithPagination(this.productModel, {
        page,
        limit,
        sortBy: 'product_name',
        sortOrder: 'asc',
        populate: [{ path: 'compatibleWith', model: 'Product' }],
      }),
      'Failed to retrieve products',
      '',
      HttpStatus.OK, // Expecting empty array is fine
    );
  }

  // Fetch product by ID
  findOne(id: string): Promise<Product> {
    return handleDatabaseOperation(
      this.productModel
        .findById(id)
        .populate({ path: 'compatibleWith', model: 'Product' }),
      'Database operation failed',
      `Product not found`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.NOT_FOUND,
    );
  }

  findByIds(productIds: string[]): Promise<Product[]> {
    return this.productModel
      .find({
        _id: { $in: productIds },
      })
      .exec();
  }

  // Update product by ID
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return handleDatabaseOperation(
      this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec(),
      'Failed to update product',
      `Product not found`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.NOT_FOUND,
    );
  }
}
