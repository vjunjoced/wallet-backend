import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '@models/product.schema';
import { Model, Types } from 'mongoose';
import { AppError } from '@class/app-error';

@Injectable()
export class ProductsService {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) { }

  getAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async getById(id: string): Promise<Product | AppError> {
    const product = await this.productModel.findOne({_id:id}).exec();

    if (!product) {
      return new AppError('product_not_found', 404);
    }

    return product;
  }

  async getBySymbol(symbol: string): Promise<Product | AppError> {
    const product = await this.productModel.findOne({ symbol }).exec();

    if (!product) {
      return new AppError('product_not_found', 404);
    }

    return product;
  }

  save(body): Promise<Product> {
    const product = new this.productModel(body);
    return product.save();
  }

  async update(id: string, body): Promise<Product | AppError> {
    const product = await this.productModel.findOne({ _id: id }).exec();

    if (!product) {
      return new AppError('product_not_found', 404);
    }

    product.set(body);
    await product.save();

    return product;
  }

  async delete(id: string): Promise<boolean | AppError> {
    const product: Product | AppError = await this.getById(id);

    if (product instanceof AppError) {
      return product;
    }

    await product.remove();
    return true;
  }
}
