import { Expose, plainToClass, Type } from 'class-transformer';

export class ProductEntity {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  symbol: string;
  
  @Expose()
  image: string;

  @Expose()
  price: number;

  constructor(partial) {
    Object.assign(this, plainToClass(ProductEntity, partial, { strategy: 'excludeAll' }));
  }
}
