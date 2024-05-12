import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FundsService } from './funds.service';
import { CreateFundDto } from './dtos/create-fund.dto';
import { AddFundDto } from './dtos/add-fund.dto';
import { AttachPaymentDto } from './dtos/attach-payment.dto';

@Controller('funds')
export class FundsController {
  constructor(private fundsService: FundsService) {}

  @Post('add')
  async add(@Body() addFundDto: AddFundDto) {
    return this.fundsService.add(addFundDto);
  }

  @Get('customer/:id')
  async findCustomerById(@Param('id') id: string) {
    return this.fundsService.findStripeCustomerById(id);
  }

  @Post('customer')
  async createCustomer(@Body() createFundDto: CreateFundDto) {
    return this.fundsService.create(createFundDto);
  }

  @Get('payment/:customer_id')
  async findPaymentByCustomerId(@Param('customer_id') customerId: string) {
    return this.fundsService.getPaymentByCustomerId(customerId);
  }

  @Post('attach_payment')
  async attachPayment(@Body() attachPaymentDto: AttachPaymentDto) {
    return this.fundsService.attachPayment(attachPaymentDto);
  }
}
