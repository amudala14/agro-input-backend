import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';

mongoose.set('debug', true);

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  type: string; // 'fertilizer' or 'seed'

  @Prop({ required: true })
  product_name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  compatibleWith: Types.Array<Types.ObjectId>;

  @Prop()
  maximumQuantityPerAcre: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
