import { Expose, plainToClass, Type, Transform } from 'class-transformer';
import { ProductEntity } from './product';
import { Model } from 'mongoose';

export class TransactionEntity {
  @Expose()
  id: string;

  @Expose()
  quantity: number;

  @Expose()
  createdAt: string;

  @Expose()
  type: string;

  @Expose()
  status: string;

  @Expose()
  addressTo: string;

  @Expose()
  addressFrom: string;

  @Transform((value, obj) => {
    if (obj["product"] && obj["product"] instanceof Model) {
      return new ProductEntity(obj["product"]);
    } else {
      return obj["product"];
    }
  })
  @Expose()
  product: ProductEntity | string;

  constructor(partial) {
    Object.assign(this, plainToClass(TransactionEntity, partial, { strategy: 'excludeAll' }));
  }
}
