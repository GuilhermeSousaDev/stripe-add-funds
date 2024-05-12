import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

export interface ICustomerCash {
  customerCash: number | null;
  setCustomerCash: Dispatch<SetStateAction<number | null>>;
}

export const CustomerCashContext = createContext<ICustomerCash | null>(null);

export const CustomerCashProvider = ({ children }: { children: ReactNode }) => {
  const [customerCash, setCustomerCash] =
    useState<ICustomerCash['customerCash']>(null);

  return (
    <CustomerCashContext.Provider value={{ customerCash, setCustomerCash }}>
      {children}
    </CustomerCashContext.Provider>
  );
};
