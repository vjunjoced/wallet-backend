import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class TransactionReceiveDto {
  @IsNotEmpty()
  addressTo: string;
  
  @IsNotEmpty()
  quantity: number;
  
  @IsNotEmpty()
  addressFrom: string;
}
