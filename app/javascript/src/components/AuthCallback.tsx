import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('jwt', token);
      navigate('/', { replace: true });
    } else {
      navigate('/signup');
    }
  }, [location.search, navigate]);

  return <p>Signing you in...</p>;
}
