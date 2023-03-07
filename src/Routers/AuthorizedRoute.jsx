// import React from 'react';
// import { Navigate, Outlet } from "react-router-dom";
// import { useCookies } from 'react-cookie';

// export default function AuthorizedRoute() {

//     const [cookies] = useCookies();

//     // return (cookies.isLogin === 'true') ? <Outlet /> : <Navigate to='/login' />
//     return (cookies.isLogin === 'true') ? <Outlet /> : <Navigate to='/' />
// }

import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const getUserToken = JSON.parse(localStorage.getItem("userInfo"));
  if (!getUserToken?.userInfo?.token) {
    // not logged in so redirect to login page with the return url
    // state={{ from: history.location }}
    return <Navigate to="/" />;
  }

  // authorized so return child components
  return children;
}
