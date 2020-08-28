import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Product } from './product.schema';

@Schema({
  timestamps: true
})
export class Wallet extends Document {
  @Prop({
    default: 0
  })
  quantity: number;

  @Prop({
    required: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    maxlength: 255
  })
  address: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  })
  product: string | Product;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);