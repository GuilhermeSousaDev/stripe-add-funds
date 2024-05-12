import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  StripeCardCvcElementOptions,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementOptions,
} from '@stripe/stripe-js';
import { Button } from './ui/button';
import React, { useContext, useState } from 'react';
import { addFunds, attachPayment } from '@/services/funds';
import { getSavedAccount } from '@/utils/account';
import { priceInCents } from '@/utils/funds';
import { Loading } from './Loading';
import { toast } from 'sonner';
import { CustomerCashContext, ICustomerCash } from '@/context/CustomerCash';

interface StripeCardElementsProps {
  setOpen: (open: boolean) => void;
  fundsToAdd: number;
}

const style = {
  base: {
    color: '#ffffff',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};

const CARD_ELEMENT_OPTIONS: StripeCardNumberElementOptions = {
  showIcon: true,
  style,
};

const CARD_CVC_OPTIONS: StripeCardCvcElementOptions = {
  style,
};

const CARD_EXPIRY_OPTIONS: StripeCardExpiryElementOptions = {
  style,
};

export default function StripeCardElements({
  setOpen,
  fundsToAdd,
}: StripeCardElementsProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { customerCash, setCustomerCash } = useContext(
    CustomerCashContext,
  ) as ICustomerCash;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    const cardCVC = elements.getElement(CardCvcElement);
    const cardExpiry = elements.getElement(CardExpiryElement);

    const card = {
      ...cardNumber,
      ...cardCVC,
      ...cardExpiry,
    };

    try {
      setLoading(true);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });

      if (error && error.message) {
        setError(error.message);
        return;
      }

      const customerId = getSavedAccount();

      if (paymentMethod?.id && customerId) {
        await attachPayment({
          customerId,
          paymentMethodId: paymentMethod.id,
        });

        try {
          if (!fundsToAdd) return;

          await addFunds({
            amount: priceInCents(fundsToAdd),
            stripeCustomerId: customerId,
          });

          toast(`Você adicinou $${fundsToAdd} a sua carteira`);

          if (customerCash) {
            setCustomerCash(customerCash + fundsToAdd * 100);
          }
        } catch {
          /* empty */
        }

        setOpen(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <span className="mb-2 text-destructive">{error}</span>

      <div className="flex flex-col space-y-4">
        <div className="border border-secondary rounded-lg p-2">
          <CardNumberElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={() => setError('')}
          />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="border border-secondary rounded-lg p-2 flex-1">
            <CardExpiryElement
              options={CARD_EXPIRY_OPTIONS}
              onChange={() => setError('')}
            />
          </div>
          <div className="border border-secondary rounded-lg p-2 flex-1">
            <CardCvcElement
              options={CARD_CVC_OPTIONS}
              onChange={() => setError('')}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          {loading ? <Loading /> : 'Save'}
        </Button>
      </div>
    </form>
  );
}
