import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Wallet } from './wallet.schema';

@Schema({
  timestamps: true
})
export class Transaction extends Document {
  @Prop({
    default: 0
  })
  quantity: number;

  @Prop({
    type: String,
    enum: ['receive', 'send'],
    required: true
  })
  type: string;

  @Prop({
    type: String,
    enum: ['pending', 'expired', 'success'],
    default: 'pending',
    required: true
  })
  status: string;

  @Prop({
    type: String,
    required: true,
  })
  addressTo: string;

  @Prop({
    type: String,
    required: true,
  })
  addressFrom: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  })
  walletTo: Wallet | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  })
  walletFrom: Wallet | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  })
  product: string | Product;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);