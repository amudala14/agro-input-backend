import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Farmer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  landSize: number; // in acres
}

export const FarmerSchema = SchemaFactory.createForClass(Farmer);
