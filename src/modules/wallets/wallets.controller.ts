import { Controller, Param, Post, Put, Delete, Body, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ResponseApp } from '@class/response-app';
import { AppError } from '@class/app-error';
import { WalletEntity } from '@entity/wallet';
import { Types } from 'mongoose';
import { Wallet } from '@models/wallet.schema';
import { WalletCreateDto } from './dto/create.dto';
import { WalletUpdateDto } from './dto/update.dto';

@Controller('api/wallets')
export class WalletsController {

  constructor(private walletsService: WalletsService) { }

  @Get('/')
  async getAll(): Promise<ResponseApp<WalletEntity[]>> {
    const wallets: Wallet[] = await this.walletsService.getAll();

    return new ResponseApp<WalletEntity[]>(wallets.map((el) => new WalletEntity(el)));
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<ResponseApp<WalletEntity>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const wallet: Wallet | AppError = await this.walletsService.getById(id);

    if (wallet instanceof AppError) {
      throw wallet;
    }

    return new ResponseApp<WalletEntity>(new WalletEntity(wallet));
  }

  @Post('/')
  async save(@Body() body: WalletCreateDto): Promise<ResponseApp<WalletEntity>> {
    const wallet: Wallet | AppError = await this.walletsService.save(body);

    if (wallet instanceof AppError) {
      throw wallet;
    }

    const resp = new ResponseApp<WalletEntity>();
    resp.data = new WalletEntity(wallet);
    return resp;
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: WalletUpdateDto): Promise<ResponseApp<WalletEntity>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const wallet: Wallet | AppError = await this.walletsService.update(id, body);

    if (wallet instanceof AppError) {
      throw wallet;
    }

    return new ResponseApp<WalletEntity>(new WalletEntity(wallet));
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<ResponseApp<boolean>> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('invalid_id', 400);
    }

    const wallet: boolean | AppError = await this.walletsService.delete(id);

    if (wallet instanceof AppError) {
      throw wallet;
    }

    return new ResponseApp<boolean>(true);
  }
}
