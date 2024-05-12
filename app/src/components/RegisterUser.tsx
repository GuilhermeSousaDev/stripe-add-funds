import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCustomer } from '@/services/funds';
import { setSavedAccount } from '@/utils/account';
import { useState } from 'react';

interface RegisterUserProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function RegisterUser({ open, setOpen }: RegisterUserProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCreateCustomer = async () => {
    if (!name || !email) return;

    try {
      const customer = await createCustomer({ name, email });

      setSavedAccount(customer.data.stripeCustomerId);
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Create your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={({ target: { value } }) => setName(value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              onChange={({ target: { value } }) => setEmail(value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateCustomer}>
            Save customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
