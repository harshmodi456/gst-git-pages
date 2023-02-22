import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function AuthorizedRoute() {

    const [cookies] = useCookies();

    return (cookies.isLogin === 'true') ? <Outlet /> : <Navigate to='/login' />
}