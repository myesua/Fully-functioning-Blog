import React from 'react';
import LoginUI from '../components/login';

const Login = ({ user }) => {
  return (
    <div>
      <LoginUI user={user} />
    </div>
  );
};

export default Login;
