import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCardElements from './StripeCardElements';

interface RegisterCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fundsToAdd: number;
}

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_KEY);

export function RegisterCard({ open, setOpen, fundsToAdd }: RegisterCardProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ mode: 'setup', currency: 'usd' }}
    >
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Payment Card</DialogTitle>
            <DialogDescription>
              Enter your payment card details below.
            </DialogDescription>
          </DialogHeader>

          <StripeCardElements setOpen={setOpen} fundsToAdd={fundsToAdd} />
        </DialogContent>
      </Dialog>
    </Elements>
  );
}
