// import AuthorizedRoute from "../Routers/AuthorizedRoute.jsx";
// import PublicRoute from "../Routers/PublicRoute.jsx";
import Signup from "../Pages/Signup/Signup.jsx";
import Login from "../Pages/Login/Login.jsx";
// import Dashboard from "../Pages/Dashboard/Dashboard.jsx";
import SearchGstNumber from "../Pages/SearchGstNumber/SearchGstNumber.jsx";
import SearchBusinessResult from "../Pages/SearchBusinessResult/SearchBusinessResult.jsx";
import GstInformation from "../Pages/GstInformation/GstInformation.jsx";
import MyReviews from "../Pages/MyReviews/MyReviews.jsx";
import MyBusiness from "../Pages/MyBusiness/MyBusiness.jsx";
import UserProfile from "../Pages/UserProfile/UserProfile.jsx";

export const routeData = [
  {
    path: "/signup",
    // route: PublicRoute,
    isAuthenticated: false,
    element: Signup
  },
  {
    path: "/login",
    // path: "/",
    // route: PublicRoute,
    isAuthenticated: false,
    element: Login
  },
  {
    path: "/",
    // path: "/search-gst-number",
    // route: AuthorizedRoute,
    // isAuthenticated: true,
    isAuthenticated: false,
    element: SearchGstNumber
  },
  /* ------- Currently disable for now ------- */
  // {
  //   path: "/business-result",
  //   isAuthenticated: false,
  //   element: SearchBusinessResult
  // },
  {
    // path: "/gst-information",
    path: "/gst-information/:gstNumber",
    // route: AuthorizedRoute,
    isAuthenticated: true,
    element: GstInformation
  },
  {
    path: "/my-reviews",
    isAuthenticated: true,
    element: MyReviews
  },
  {
    path: "/my-business",
    isAuthenticated: true,
    element: MyBusiness
  },
  {
    path: "/user-profile",
    isAuthenticated: true,
    element: UserProfile
  }
];

// export const publicRouteData = [
//   {
//     path: "/signup",
//     // route: PublicRoute,
//     element: Signup
//   },
//   {
//     // path: "/login",
//     path: "/",
//     // route: PublicRoute,
//     element: Login
//   },
// ];

// export const authorizedRouteData = [
//   {
//     // path: "/",
//     path: "/search-gst-number",
//     // route: AuthorizedRoute,
//     element: SearchGstNumber
//   },
//   {
//     path: "/business-result",
//     // route: AuthorizedRoute,
//     element: SearchBusinessResult
//   },
//   {
//     path: "/gst-information",
//     // route: AuthorizedRoute,
//     element: GstInformation
//   }
// ]
