import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from '@models/wallet.schema';
import { AppError } from '@class/app-error';
import { WalletCreateDto } from './dto/create.dto';
import { ProductsService } from '../products/products.service';
import { ModuleRef } from '@nestjs/core';
import { Product } from '@models/product.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletsService {
  private productsService: ProductsService;

  constructor(@InjectModel('Wallet') private readonly walletModel: Model<Wallet>, private readonly moduleRef: ModuleRef) { }

  onModuleInit(): void {
    this.productsService = this.moduleRef.get(ProductsService, { strict: false });
  }

  getAll(): Promise<Wallet[]> {
    return this.walletModel.find().populate('product').exec();
  }

  async getById(id: string): Promise<Wallet | AppError> {
    const wallet = await this.walletModel.findOne({ _id: id }).populate('product').exec();

    if (!wallet) {
      return new AppError('wallet_not_found', 404);
    }

    return wallet;
  }

  async save(body: WalletCreateDto): Promise<Wallet | AppError> {
    // check product
    const product : Product | AppError = await this.productsService.getById(body.product);

    if (product instanceof AppError) {
      return new AppError('product_not_found', 404);
    }
    
    const wallet = new this.walletModel({ ...body, ...{ product: product, address: uuidv4() } });
    await wallet.save();

    return wallet;
  }

  async update(id: string, body): Promise<Wallet | AppError> {
    const wallet = await this.walletModel.findOne({ _id: id }).exec();

    if (!wallet) {
      return new AppError('wallet_not_found', 404);
    }

    wallet.set(body);
    await wallet.save();

    return wallet;
  }

  async delete(id: string): Promise<boolean | AppError> {
    const wallet: Wallet | AppError = await this.getById(id);

    if (wallet instanceof AppError) {
      return wallet;
    }

    await wallet.remove();
    return true;
  }
}
