import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddFundDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  stripeCustomerId: string;
}
