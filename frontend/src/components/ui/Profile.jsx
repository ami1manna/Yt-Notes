import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <NavLink to='/login'>Please log in</NavLink>;

  return (
    <div>
      <h1>Welcome {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}