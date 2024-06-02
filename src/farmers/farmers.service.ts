import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { Farmer } from './schemas/farmer.schema';
import { CreateFarmerDto } from './dto/createFarmer.dto';
import { UpdateFarmerDto } from './dto/updateFarmer.dto';
import { handleDatabaseOperation } from '../common/helpers/service-helper';
import { findWithPagination } from '../common/utils/pagination.util';

@Injectable()
export class FarmersService {
  constructor(@InjectModel(Farmer.name) private farmerModel: Model<Farmer>) {}

  // Fetch all farmers with pagination
  findAll(page: number, limit: number): Promise<Farmer[]> {
    return handleDatabaseOperation(
      findWithPagination(this.farmerModel, {
        page,
        limit,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
      'Failed to retrieve farmers',
      '',
      HttpStatus.OK, // Expecting empty array is fine
    );
  }

  // Fetch a single farmer by ID
  findOne(id: string): Promise<Farmer> {
    return handleDatabaseOperation(
      this.farmerModel.findById(id).exec(),
      'Database operation failed',
      `Farmer not found`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.NOT_FOUND,
    );
  }

  // Create a new farmer
  create(createFarmerDto: CreateFarmerDto): Promise<Farmer> {
    return handleDatabaseOperation(
      this.farmerModel.create(createFarmerDto),
      'Failed to create farmer',
      '',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Update an existing farmer
  update(id: string, updateFarmerDto: UpdateFarmerDto): Promise<Farmer> {
    return handleDatabaseOperation(
      this.farmerModel
        .findByIdAndUpdate(id, updateFarmerDto, { new: true })
        .exec(),
      'Failed to update farmer',
      `Product not found`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.NOT_FOUND,
    );
  }
}
