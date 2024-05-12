import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RegisterCard } from './RegisterCard';
import { useContext, useState } from 'react';
import { getSavedAccount } from '@/utils/account';
import { addFunds, getPaymentByCustomer } from '@/services/funds';
import { priceInCents } from '@/utils/funds';
import { Loading } from './Loading';
import { toast } from 'sonner';
import { CustomerCashContext, ICustomerCash } from '@/context/CustomerCash';

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
}

const pricingList: PricingProps[] = [
  {
    title: 'Initial',
    popular: 0,
    price: 5,
    description: 'Mininum fund level',
  },
  {
    title: 'Normal',
    popular: 1,
    price: 10,
    description: 'Normal fund level',
  },
  {
    title: 'Enterprise',
    popular: 0,
    price: 20,
    description: 'Enterprise fund level',
  },
  {
    title: 'Premium',
    popular: 0,
    price: 30,
    description: 'Premium fund level',
  },
  {
    title: 'Gold',
    popular: 0,
    price: 40,
    description: 'Gold fund level',
  },
  {
    title: 'Diamond',
    popular: 0,
    price: 50,
    description: 'Diamond fund level',
  },
];

export const Pricing = () => {
  const { customerCash, setCustomerCash } = useContext(
    CustomerCashContext,
  ) as ICustomerCash;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fundsToAdd, setFundsToAdd] = useState<number | null>(null);

  const handleAddFunds = async (price: number) => {
    const customer = getSavedAccount();

    if (!customer) {
      window.location.reload();
      return;
    }

    const payment = await getPaymentByCustomer(customer);
    setFundsToAdd(price);

    if (!payment.data) {
      setOpen(true);
      return;
    }

    try {
      setLoading(true);

      await addFunds({
        amount: priceInCents(price),
        stripeCustomerId: customer,
      });

      toast(`Você adicinou $${price} a sua carteira`);

      if (customerCash) {
        setCustomerCash(customerCash + price * 100);
      }
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="container py-24 sm:py-32">
      {fundsToAdd && (
        <RegisterCard open={open} setOpen={setOpen} fundsToAdd={fundsToAdd} />
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Add
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {' '}
          Funds{' '}
        </span>
        on your wallet
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Choose how much cash you will put in
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? 'drop-shadow-xl shadow-black/10 dark:shadow-white/10'
                : ''
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Most used
                  </Badge>
                ) : null}
              </CardTitle>
              <div className="mb-10">
                <span className="text-3xl font-bold">${pricing.price}</span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                className="w-full"
                onClick={() => handleAddFunds(pricing.price)}
              >
                {loading && fundsToAdd === pricing.price ? (
                  <Loading />
                ) : (
                  'Add funds'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
