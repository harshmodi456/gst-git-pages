import AuthorizedRoute from '../Routers/AuthorizedRoute.jsx';
import PublicRoute from '../Routers/PublicRoute.jsx';
import Signup from '../Pages/Signup/Signup.js';
import Login from '../Pages/Login/Login.jsx';
import Dashboard from '../Pages/Dashboard/Dashboard.jsx';

export const routeData = [
    {
        path: "/signup",
        route: PublicRoute,
        element: Signup,
    },
    {
        path: "/login",
        route: PublicRoute,
        element: Login,
    },
    {
        path: "/",
        route: AuthorizedRoute,
        element: Dashboard,
    },
]