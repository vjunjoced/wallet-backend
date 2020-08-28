import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from '@models/wallet.schema';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Wallet', schema: WalletSchema }
    ]),
  ],
  controllers: [WalletsController],
  providers: [WalletsService]
})
export class WalletsModule {}
