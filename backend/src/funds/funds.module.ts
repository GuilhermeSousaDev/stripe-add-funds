import { Module } from '@nestjs/common';
import { FundsController } from './funds.controller';
import { FundsService } from './funds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funds } from './funds.entity';
import { StripeService } from './stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funds])],
  controllers: [FundsController],
  providers: [FundsService, StripeService],
})
export class FundsModule {}
