import Cookies from 'js-cookie';

export const getSavedAccount = () => {
  const user = Cookies.get('user');

  return user;
};

export const setSavedAccount = (id: string) => {
  Cookies.set('user', id, { expires: 10 });
};
