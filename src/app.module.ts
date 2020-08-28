import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductSchema } from '@models/product.schema';
import { WalletsService } from 'src/modules/wallets/wallets.service';
import { ProductsService } from 'src/modules/products/products.service';
import { TransactionsService } from 'src/modules/transactions/transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from '@pipes/http-error.filter';
import { ProductsModule } from './modules/products/products.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { dbUrl } from '@app';

@Module({
  imports: [
    MongooseModule.forRoot(dbUrl),
    ProductsModule,
    WalletsModule,
    TransactionsModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }],
})
export class AppModule { }
