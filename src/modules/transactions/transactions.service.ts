import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsService } from '../products/products.service';
import { Model } from 'mongoose';
import { Transaction } from '@models/transaction.schema';
import { Wallet } from '@models/wallet.schema';
import { ModuleRef } from '@nestjs/core';
import { AppError } from '@class/app-error';
import { Product } from '@models/product.schema';

@Injectable()
export class TransactionsService {
  private productsService: ProductsService;

  constructor(
    @InjectModel('Wallet') private readonly walletModel: Model<Wallet>,
    @InjectModel('Transaction') private readonly trasactionModel: Model<Transaction>,
    private readonly moduleRef: ModuleRef) { }

  onModuleInit(): void {
    this.productsService = this.moduleRef.get(ProductsService, { strict: false });
  }

  getAll(query: any = {}): Promise<Transaction[]> {
    const where: any = {};

    if (query.walletId) {
      where["$or"] = [{ walletTo: query.walletId }, { walletFrom: query.walletId } ]
    }

    return this.trasactionModel.find(where).sort({createdAt: -1} ).populate('product').exec();
  }

  async getById(id: string): Promise<Transaction | AppError> {
    const transaction = await this.trasactionModel.findOne({ _id: id }).populate('product').exec();

    if (!transaction) {
      return new AppError('transaction_not_found', 404);
    }

    return transaction;
  }

  async save(body): Promise<Transaction | AppError> {
    // check wallet
    const wallet: Wallet = await this.walletModel.findById(body.wallet);

    if (!wallet) {
      return new AppError('wallet_not_found', 404);
    }

    // check balance
    if (body.quantity > wallet.quantity) {
      return new AppError('balance_not_found', 400);
    }

    // check product
    const product: Product | AppError = await this.productsService.getById(wallet.product as string);

    if (product instanceof AppError) {
      return new AppError('product_not_found', 404);
    }

    // check if address is wallet
    const walletTo = await this.walletModel.findOne({
      address: body.addressTo,
      product: wallet.product
    });

    // create transaction
    const transaction = new this.trasactionModel({
      quantity: body.quantity,
      type: body.type,
      status: 'pending',
      addressTo: body.addressTo,
      addressFrom: wallet.address,
      walletTo: walletTo ? walletTo : null,
      walletFrom: wallet,
      product: product
    });

    await transaction.save();

    // update balance wallet

    wallet.quantity -= transaction.quantity;
    await wallet.save();

    if (walletTo) {
      walletTo.quantity += transaction.quantity;
      await walletTo.save();
    }

    setTimeout(async () => {
      const status = this.resultStatus();

      if (status === 'expired') {
        wallet.quantity += transaction.quantity;

        if (walletTo) {
          walletTo.quantity -= transaction.quantity;
          await walletTo.save();
        }
      }

      transaction.set({
        status
      });
      await Promise.all([transaction.save(), wallet.save()]);
    }, this.getRandomArbitrary(5, 10) * 1000);

    return transaction;
  }

  async receive(body): Promise<Transaction | AppError> {
    const walletTo = await this.walletModel.findOne({
      address: body.addressTo
    });

    if (!walletTo) {
      return new AppError('wallet_not_found', 404);
    }

    const walletFrom = await this.walletModel.findOne({
      address: body.addressFrom
    });

    if (walletFrom) {
      if (body.quantity > walletFrom.quantity) {
        return new AppError('balance_not_found', 404);
      }
    }

    const transaction = new this.trasactionModel({
      quantity: body.quantity,
      type: body.type,
      status: 'success',
      addressTo: body.addressTo,
      addressFrom: body.addressFrom,
      walletTo: walletTo,
      product: walletTo.product,
      walletFrom: walletFrom ? walletFrom : null
    });

    await transaction.save();

    walletTo.quantity += transaction.quantity;
    await walletTo.save();

    if (walletFrom) {
      walletFrom.quantity -= transaction.quantity;
      await walletFrom.save();
    }

    return transaction;
  }

  private resultStatus(): string {
    const list = ['success', 'expired', 'success', 'success', 'success', 'expired', 'success', 'success', 'success', 'success'];
    const index = Math.floor(this.getRandomArbitrary(0, list.length - 1));
    return list[index];
  }

  private getRandomArbitrary(min, max): number {
    return Math.random() * (max - min) + min;
  }
}
