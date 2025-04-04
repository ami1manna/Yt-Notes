import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PlainButton from './PlainButton';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();  

  if (!user)
    return (
      <PlainButton onClick={() => navigate('/login')}>Login</PlainButton>
    );

  return (
    <div>
      {/* <h1>Welcome {user.username}!</h1> */}
      <PlainButton onClick={logout}>Logout</PlainButton>
    </div>
  );
}
