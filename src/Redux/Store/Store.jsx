import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import SignUpReducer from "../Reducers/SignInUpReducer";
import SearchGstNumberReducer from '../Reducers/SearchGstNumReducer'
const Store = configureStore({
  reducer: {
    signUpUser: SignUpReducer,
    SearchGstNumber: SearchGstNumberReducer,
    // chatsReducer: ChatsReducer
  }
});

export const useAppDispatch = () => useDispatch();
export default Store;
