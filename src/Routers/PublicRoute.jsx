import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function PublicRoute() {

    const [cookies] = useCookies();

    return (cookies.isLogin !== 'true') ? <Outlet /> : <Navigate to='/' />
}
