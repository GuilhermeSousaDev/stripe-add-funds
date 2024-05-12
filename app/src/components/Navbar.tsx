import { useContext, useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { buttonVariants } from './ui/button';
import { Menu } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { LogoIcon } from './Icons';
import { Loading } from './Loading';
import { CustomerCashContext, ICustomerCash } from '@/context/CustomerCash';

export const Navbar = () => {
  const { customerCash } = useContext(CustomerCashContext) as ICustomerCash;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a href="/" className="ml-2 font-bold text-xl flex">
              <LogoIcon />
              Funds
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Funds</SheetTitle>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <div className="hidden md:flex gap-2 items-center">
            {customerCash ? (
              <span className="text-primary">
                {(customerCash / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </span>
            ) : (
              <Loading />
            )}
            <a
              href="https://github.com/GuilhermeSousaDev"
              target="_blank"
              className={`border ${buttonVariants({ variant: 'secondary' })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </a>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
