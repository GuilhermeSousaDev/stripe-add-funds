import { IsNotEmpty, IsString } from 'class-validator';

export class AttachPaymentDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
