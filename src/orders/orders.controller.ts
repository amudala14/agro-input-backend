import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  ParseEnumPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, orderStatus } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Order } from './schemas/order.schema';
import { OrderCalculationInterceptor } from './interceptors/orderCalculation.interceptor';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ): Promise<Order[]> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    return this.ordersService.findAll(safePage, safeLimit);
  }

  @Post()
  @UseInterceptors(OrderCalculationInterceptor)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.placeOrder(createOrderDto);
  }

  @Put(':id/status/:status')
  updateOrderStatus(
    @Param('id') id: string,
    @Param('status', new ParseEnumPipe(orderStatus)) status: orderStatus,
  ) {
    return this.ordersService.updateOrder(id, { status });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }
}
