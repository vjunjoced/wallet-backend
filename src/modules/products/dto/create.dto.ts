import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  price: number;
}
