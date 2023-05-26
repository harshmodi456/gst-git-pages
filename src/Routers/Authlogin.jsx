import { Navigate } from "react-router-dom";

export default function AuthLogin({ children }) {
  const getUserToken = JSON.parse(localStorage.getItem("userInfo"));
  if (getUserToken?.success) {
    return <Navigate to="/" />;
  }

  return children;
}