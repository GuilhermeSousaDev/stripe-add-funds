import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

interface ICreatePayment {
  amount: number;
  customer: { id: string; paymentMethod: string };
}

interface ICreateCustomer {
  name: string;
  email: string;
}

interface IAttachPayment {
  paymentMethodId: string;
  customerId: string;
}

@Injectable()
export class StripeService {
  stripe: Stripe;

  constructor() {
    if (!this.stripe) {
      this.stripe = new Stripe(process.env.STRIPE_KEY);
    }
  }

  async createPayment({ amount, customer }: ICreatePayment) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: false,
      },
      payment_method_types: ['card'],
      confirm: true,
      customer: customer.id,
      payment_method: customer.paymentMethod,
    });

    return paymentIntent;
  }

  async createCustomer({ name, email }: ICreateCustomer) {
    const customer = await this.stripe.customers.create({
      name,
      email,
    });

    return customer;
  }

  async retrievesPaymentMethod(paymentMethodId: string) {
    return this.stripe.paymentMethods.retrieve(paymentMethodId);
  }

  async attachPayment({ customerId, paymentMethodId }: IAttachPayment) {
    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      {
        customer: customerId,
      },
    );

    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    return paymentMethod;
  }
}
