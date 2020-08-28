import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class TransactionCreateDto {
  @IsNotEmpty()
  addressTo: string;
  
  @IsNotEmpty()
  quantity: number;
  
  @IsNotEmpty()
  wallet: string;
}
