import { IsNotEmpty, IsString, IsBoolean, Validate } from 'class-validator';

export class WalletCreateDto {

  @IsNotEmpty()
  product: string;

  @IsNotEmpty()
  name: string;
}
