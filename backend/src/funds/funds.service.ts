import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funds } from './funds.entity';
import { StripeService } from './stripe/stripe.service';

interface IAddFunds {
  amount: number;
  stripeCustomerId: string;
}

interface IAttachPayment {
  customerId: string;
  paymentMethodId: string;
}

interface ICreateFund {
  name: string;
  email: string;
}

@Injectable()
export class FundsService {
  constructor(
    @InjectRepository(Funds)
    private fundsRepository: Repository<Funds>,
    private stripeService: StripeService,
  ) {}

  async find() {
    return this.fundsRepository.find();
  }

  async findStripeCustomerById(id: string) {
    return this.fundsRepository.findOne({ where: { stripeCustomerId: id } });
  }

  async create({ name, email }: ICreateFund) {
    const stripeCustomer = await this.stripeService.createCustomer({
      name,
      email,
    });

    const fund = this.fundsRepository.create({
      stripeCustomerId: stripeCustomer.id,
      cash: 0,
    });

    await this.fundsRepository.save(fund);

    return fund;
  }

  async add({ amount, stripeCustomerId }: IAddFunds) {
    const fund = await this.fundsRepository.findOne({
      where: { stripeCustomerId },
    });

    if (!fund) {
      throw new NotFoundException('fund_not_found');
    }

    try {
      await this.stripeService.createPayment({
        amount,
        customer: {
          id: fund.stripeCustomerId,
          paymentMethod: fund.payment_id,
        },
      });

      fund.cash += amount;

      await this.fundsRepository.save(fund);
    } catch (e) {
      console.log(e);
    }
  }

  async getPaymentByCustomerId(customerId: string) {
    const fund = await this.fundsRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    return fund.payment_id || null;
  }

  async attachPayment({ customerId, paymentMethodId }: IAttachPayment) {
    const attachedPayment = await this.stripeService.attachPayment({
      customerId,
      paymentMethodId,
    });

    const fund = await this.fundsRepository.findOne({
      where: { stripeCustomerId: customerId },
    });

    if (!fund) throw new BadRequestException('fund_not_found');

    fund.payment_id = paymentMethodId;

    await this.fundsRepository.save(fund);

    return attachedPayment;
  }
}
