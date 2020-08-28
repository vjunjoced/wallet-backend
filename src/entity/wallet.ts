import { Expose, plainToClass, Type, Transform } from 'class-transformer';
import { ProductEntity } from './product';
import { Model } from 'mongoose';

export class WalletEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  quantity: number;

  @Expose()
  createdAt: string;

  @Expose()
  address: string;

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
    Object.assign(this, plainToClass(WalletEntity, partial, { strategy: 'excludeAll' }));
  }
}
