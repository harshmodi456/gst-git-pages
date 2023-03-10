import { useLocation } from "react-router-dom";

export default function useHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  if (
    currentPath === "/login" ||
    currentPath === "/signup"
  ) {
    return false;
  } else {
    return true;
  }
}
