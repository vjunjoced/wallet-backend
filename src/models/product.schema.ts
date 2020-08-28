import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

@Schema({
  timestamps: true
})
export class Product extends Document {
  @Prop({
    required: true,
    maxlength: 100
  })
  name: string;

  @Prop({
    required: true,
  })
  image: string;

  @Prop({
    required: true,
    maxlength: 15
  })
  symbol: string;

  @Prop({
    required: true,
    default: 0
  })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);