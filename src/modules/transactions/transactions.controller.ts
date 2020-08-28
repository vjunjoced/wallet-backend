import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { TransactionsService } from 'src/modules/transactions/transactions.service';
import { Types } from 'mongoose';
import { TransactionCreateDto } from './dto/create.dto';
import { ResponseApp } from '@class/response-app';
import { TransactionEntity } from '@entity/transaction';
import { Transaction } from '@models/transaction.schema';
import { AppError } from '@class/app-error';
import { TransactionReceiveDto } from './dto/create_receive.dto';

@Controller('api/transactions')
export class TransactionsController {

  constructor(private service: TransactionsService) { }

  @Get('/')
  async getAll(@Query() query): Promise<ResponseApp<TransactionEntity[]>> {
    const transactions: Transaction[] = await this.service.getAll(query);
    return new ResponseApp<TransactionEntity[]>(transactions.map((el) => new TransactionEntity(el)));
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<ResponseApp<TransactionEntity>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const transaction: Transaction | AppError = await this.service.getById(id);

    if (transaction instanceof AppError) {
      throw transaction;
    }

    return new ResponseApp<TransactionEntity>(new TransactionEntity(transaction));
  }


  @Post('/')
  async save(@Body() body: TransactionCreateDto): Promise<ResponseApp<TransactionEntity>> {
    if (!Types.ObjectId.isValid(body.wallet)) {
      throw new AppError('invalid_wallet', 400);
    }

    const data: any = body;
    data.type = 'send';

    const transaction: Transaction | AppError = await this.service.save(body);
    
    if (transaction instanceof AppError) {
      throw transaction;
    }

    return new ResponseApp<TransactionEntity>(new TransactionEntity(transaction));
  }

  @Post('/receive')
  async receive(@Body() body: TransactionReceiveDto): Promise<ResponseApp<TransactionEntity>> {
    const data: any = body;
    data.type = 'receive';

    const transaction: Transaction | AppError = await this.service.receive(body);
    
    if (transaction instanceof AppError) {
      throw transaction;
    }

    return new ResponseApp<TransactionEntity>(new TransactionEntity(transaction));
  }
}
