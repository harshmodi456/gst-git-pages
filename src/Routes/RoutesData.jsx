import AuthorizedRoute from "../Routers/AuthorizedRoute.jsx";
import PublicRoute from "../Routers/PublicRoute.jsx";
import Signup from "../Pages/Signup/Signup.jsx";
import Login from "../Pages/Login/Login.jsx";
// import Dashboard from "../Pages/Dashboard/Dashboard.jsx";
import SearchGstNumber from "../Pages/SearchGstNumber/SearchGstNumber.jsx";
import SearchBusinessResult from "../Pages/SearchBusinessResult/SearchBusinessResult.jsx";
import GstInformation from "../Pages/GstInformation/GstInformation.jsx";

export const routeData = [
  {
    path: "/signup",
    route: PublicRoute,
    element: Signup
  },
  {
    // path: "/login",
    path: "/",
    route: PublicRoute,
    element: Login
  },
  {
    // path: "/",
    path: "/search-gst-number",
    route: AuthorizedRoute,
    element: SearchGstNumber
  },
  {
    path: "/business-result",
    route: AuthorizedRoute,
    element: SearchBusinessResult
  },
  {
    path: "/gst-information",
    route: AuthorizedRoute,
    element: GstInformation
  }
];
