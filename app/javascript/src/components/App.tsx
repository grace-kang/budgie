import { useEffect, useState } from 'react';
import SignIn from './SignIn';
import { apiFetch } from '../apiClient';
import Months from './Months';

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    apiFetch('/users/me')
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  return <div>{loggedIn === null ? <p>Loading...</p> : loggedIn ? <Months /> : <SignIn />}</div>;
}
