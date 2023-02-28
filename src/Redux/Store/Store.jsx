import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import SignUpReducer from "../Reducers/SignInUpReducer";
const Store = configureStore({
  reducer: {
    signUpUser: SignUpReducer,
    // chatsReducer: ChatsReducer
  }
});

export const useAppDispatch = () => useDispatch();
export default Store;
