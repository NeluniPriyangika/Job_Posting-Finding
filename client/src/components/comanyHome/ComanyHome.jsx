import React from 'react';
import { useLogout } from '../logOut/LogOut';

const CompanyHome = () => {
  const logout = useLogout();

  return (
    <div>
      <h1>Welcome to Company Home</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default CompanyHome;