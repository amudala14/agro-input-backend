import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Farmer', required: true })
  farmerId: Types.ObjectId;

  @Prop([
    {
      type: {
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    },
  ])
  productDetails: { product: Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  status: string; // 'Pending', 'Approved', 'Rejected'
}

export const OrderSchema = SchemaFactory.createForClass(Order);
