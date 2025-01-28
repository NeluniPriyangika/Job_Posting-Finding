import React from 'react';
import { useLogout } from '../logOut/LogOut';

const SeekerHome = () => {
  const logout = useLogout();

  return (
    <div>
      <h1>Welcome to Seeker Home</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default SeekerHome;