import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/auth/AuthContextBase";
import PlainButton from '../common/PlainButton';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();  

 
  
  if (!user)
    return (
      <PlainButton onClick={() => navigate('/login')}>Login</PlainButton>
    );

  return (
    <div>
      {/* <h1>Welcome {user.username}! </h1> */}
      <PlainButton onClick={logout}>Logout</PlainButton>
    </div>
  );
}
