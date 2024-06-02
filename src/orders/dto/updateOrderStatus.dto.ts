import { IsEnum } from 'class-validator';
import { orderStatus } from './createOrder.dto';

export class UpdateOrderStatusDto {
  @IsEnum(orderStatus, {
    message: 'Order status must be either Approved, Pending, or Rejected.',
  })
  status: orderStatus;
}
