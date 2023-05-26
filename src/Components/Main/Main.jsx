import React from "react";
import "./Main.css";
import useHeaderFooter from "../Header/Hooks/useHeader.jsx";
import { Routes, Route } from "react-router-dom";
import { routeData } from "../../Routes/RoutesData";
import PrivateRoute from "../../Routers/AuthorizedRoute";
import NotFound from "../../Pages/NotFound/NotFound";
import AuthLogin from "../../Routers/Authlogin";
export default function Main() {
  const isVisibleHeader = useHeaderFooter();

  return (
    <div className={`${isVisibleHeader ? "main-container" : ""}`}>
      <Routes>
        {routeData?.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                route?.isAuthenticated === true ? (
                  <PrivateRoute>
                    <route.element />
                  </PrivateRoute>
                ) : (
                  route?.login === true ? <AuthLogin><route.element/></AuthLogin>:<route.element />
                )
              }
            />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
