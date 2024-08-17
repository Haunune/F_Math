import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectRoute({ authUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authUser) {
        navigate('/login', { replace: true });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
}

export default ProtectRoute;