import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectRoute({authUser}) {
    const navigate = useNavigate();

  useEffect(() => {
    if(!authUser){
        navigate('/login', {replace: true});
    }
  }, [navigate]);

  return null;
}

export default ProtectRoute;