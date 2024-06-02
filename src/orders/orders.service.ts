import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { handleDatabaseOperation } from '../common/helpers/service-helper';
import { findWithPagination } from '../common/utils/pagination.util';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  // Create order
  async placeOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return handleDatabaseOperation(
      this.orderModel.create(createOrderDto),
      'Failed to place order',
      '',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Fetch all orders
  async findAll(page: number, limit: number): Promise<Order[]> {
    return handleDatabaseOperation(
      findWithPagination(this.orderModel, {
        page,
        limit,
        sortBy: 'name',
        sortOrder: 'asc',
        populate: [
          { path: 'farmerId', model: 'Farmer' },
          { path: 'productDetails.product', model: 'Product' }, 
        ],
      }),
      'Failed to retrieve orders',
      '',
      HttpStatus.OK, // Expecting empty array is fine
    );
  }

  // Update order by ID
  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return handleDatabaseOperation(
      this.orderModel
        .findByIdAndUpdate(id, updateOrderDto, { new: true })
        .exec(),
      'Failed to update order',
      'Order not found.',
      HttpStatus.INTERNAL_SERVER_ERROR,
      HttpStatus.NOT_FOUND,
    );
  }
}
