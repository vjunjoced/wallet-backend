import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  symbol: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  price: number;
}
