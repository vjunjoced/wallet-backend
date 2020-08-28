import { Controller, Get, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/products.service';
import { ProductEntity } from '@entity/product';
import { Product } from '@models/product.schema';
import { AppError } from '@class/app-error';
import { ProductCreateDto } from './dto/create.dto';
import { ResponseApp } from '@class/response-app';
import { Types } from 'mongoose';
import { ProductUpdateDto } from './dto/update.dto';

@Controller('api/products')
export class ProductsController {

  constructor(private productsService: ProductsService) { }

  @Get('/')
  async getAll(): Promise<ResponseApp<ProductEntity[]>> {
    const products: Product[] = await this.productsService.getAll();

    const resp = new ResponseApp<ProductEntity[]>();
    resp.data = products.map((el) => new ProductEntity(el));
    return resp;
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<ResponseApp<ProductEntity>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const product: Product | AppError = await this.productsService.getById(id);

    if (product instanceof AppError) {
      throw product;
    }

    const resp = new ResponseApp<ProductEntity>();
    resp.data = new ProductEntity(product);
    return resp;
  }

  @Get('/symbol/:symbol')
  async getByCode(@Param('symbol') symbol: string): Promise<ResponseApp<ProductEntity>> {
    const product: Product | AppError = await this.productsService.getBySymbol(symbol);

    if (product instanceof AppError) {
      throw product;
    }

    const resp = new ResponseApp<ProductEntity>();
    resp.data = new ProductEntity(product);
    return resp;
  }

  @Post('/')
  async save(@Body() body: ProductCreateDto): Promise<ResponseApp<ProductEntity>>{
    const product: Product = await this.productsService.save(body);
    
    const resp = new ResponseApp<ProductEntity>();
    resp.data = new ProductEntity(product);
    return resp;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: ProductUpdateDto): Promise<ResponseApp<ProductEntity>>{
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const product: Product | AppError = await this.productsService.update(id, body);

    if (product instanceof AppError) {
      throw product;
    }

    return new ResponseApp<ProductEntity>(new ProductEntity(product));
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<ResponseApp<boolean>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const product: boolean | AppError = await this.productsService.delete(id);

    if (product instanceof AppError) {
      throw product;
    }

    return new ResponseApp<boolean>(true);
  }
}
