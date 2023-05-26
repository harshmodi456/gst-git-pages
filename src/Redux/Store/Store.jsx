import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import SignUpReducer from "../Reducers/SignInUpReducer";
import SearchGstNumberReducer from '../Reducers/SearchGstNumReducer'
const Store = configureStore({
  reducer: {
    signUpUser: SignUpReducer,
    SearchGstNumber: SearchGstNumberReducer,
  }, middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false,
  })
});

export const useAppDispatch = () => useDispatch();
export default Store;
