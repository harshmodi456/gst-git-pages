import Signup from "../Pages/Signup/Signup.jsx";
import Login from "../Pages/Login/Login.jsx";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword.js";
import SearchGstNumber from "../Pages/SearchGstNumber/SearchGstNumber.jsx";
import GstInformation from "../Pages/GstInformation/GstInformation.jsx";
import MyReviews from "../Pages/MyReviews/MyReviews.jsx";
import MyBusiness from "../Pages/MyBusiness/MyBusiness.jsx";
import UserProfile from "../Pages/UserProfile/UserProfile.jsx";
import OurBusiness from "../Pages/OurBusiness/OurBusiness.jsx";
import ChangePassword from "../Pages/ChangePassword/ChangePassword.js";

export const routeData = [
  {
    path: "/signup",
    // route: PublicRoute,
    isAuthenticated: false,
    element: Signup
  },
  {
    path: "/login",
    // route: publicRouteData,
    login:true,
    isAuthenticated: false,
    element: Login
  },
  {
    path: "/forgot-password",
    // path: "/",
    // route: PublicRoute,
    isAuthenticated: false,
    element: ForgotPassword
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
  {
    // path: "/gst-information",
    path: "/gst-information/:gstNumber",
    // route: AuthorizedRoute,
    isAuthenticated: false,
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
  // {
  //   path: "/our-business",
  //   isAuthenticated: true,
  //   element: OurBusiness
  // },
  {
    path: "/user-profile",
    isAuthenticated: true,
    element: UserProfile
  },
  {
    path: "/change-password",
    isAuthenticated: true,
    element: ChangePassword
  }
];

export const publicRouteData = [
  {
    path: "/signup",
    // route: PublicRoute,
    element: Signup
  },
  {
    // path: "/login",
    path: "/",
    // route: PublicRoute,
    element: Login
  },
];

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
