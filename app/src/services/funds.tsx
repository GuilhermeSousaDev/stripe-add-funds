import { api } from '@/api/axios';
import { AxiosResponse } from 'axios';

interface Fund {
  id: string;
  stripeCustomerId: string;
  cash: number;
  custom_fields: JSON;
  created_at: Date;
  updated_at: Date;
}

interface ICreateFundByCustomer {
  name: string;
  email: string;
}

interface IAttachPayment {
  customerId: string;
  paymentMethodId: string;
}

interface IAddFund {
  amount: number;
  stripeCustomerId: string;
}

export const getFundByCustomer = async (
  id: string,
): Promise<AxiosResponse<Fund>> => {
  return api.get(`funds/customer/${id}`);
};

export const createCustomer = async ({
  email,
  name,
}: ICreateFundByCustomer): Promise<AxiosResponse<Fund>> => {
  return api.post('funds/customer', { name, email });
};

export const getPaymentByCustomer = async (customerId: string) => {
  return api.get(`funds/payment/${customerId}`);
};

export const attachPayment = async ({
  customerId,
  paymentMethodId,
}: IAttachPayment) => {
  return api.post('funds/attach_payment', {
    customerId,
    paymentMethodId,
  });
};

export const addFunds = async ({ amount, stripeCustomerId }: IAddFund) => {
  return api.post('funds/add', { amount, stripeCustomerId });
};
