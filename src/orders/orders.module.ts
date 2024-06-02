import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderCalculationInterceptor } from './interceptors/orderCalculation.interceptor';
import { FarmersModule } from '../farmers/farmers.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    FarmersModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderCalculationInterceptor],
})
export class OrdersModule {}
