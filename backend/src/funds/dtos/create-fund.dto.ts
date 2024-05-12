import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateFundDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
