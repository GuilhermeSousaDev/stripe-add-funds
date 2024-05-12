import { Navbar } from './components/Navbar';
import { Pricing } from './components/Pricing';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { RegisterUser } from './components/RegisterUser';
import { getFundByCustomer } from './services/funds';
import { getSavedAccount } from './utils/account';
import { CustomerCashContext, ICustomerCash } from './context/CustomerCash';

function App() {
  const { setCustomerCash } = useContext(CustomerCashContext) as ICustomerCash;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAccount = async (id: string) => {
      const customer = await getFundByCustomer(id);

      if (!customer) {
        setOpen(true);
      }

      setCustomerCash(customer.data.cash);
    };

    const user = getSavedAccount();

    if (!user) {
      setOpen(true);
      return;
    }

    fetchAccount(user);
  }, [setCustomerCash]);

  return (
    <>
      <Navbar />
      <RegisterUser open={open} setOpen={setOpen} />
      {/*
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team /> */}
      <Pricing />
    </>
  );
}

export default App;
