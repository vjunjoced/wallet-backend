import { Module } from '@nestjs/common';
import { WalletSchema } from '@models/wallet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionSchema } from '@models/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
