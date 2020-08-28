import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class WalletUpdateDto {
  @IsNotEmpty()
  name: string;
}
