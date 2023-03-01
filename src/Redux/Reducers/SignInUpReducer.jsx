import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { api } from "../../Constant/AxiosInstance";

// for sign in action and state declaration
export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
      (
        await axios.post(`${api}users/login`, data)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for sign up action and state declaration
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (data, thunkApi) => {
    try {
      return await (
        await axios.post(`${api}users/signup`, data)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for login action and state declaration
export const gstVerify = createAsyncThunk(
  "user/gstVerify",
  async (data, thunkApi) => {
    try {
      return await (
        await axios.post(`${api}gst/verify`, data)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  userInfo: {},
  userToken: null,
  error: {},
  success: false
};

const signUpUserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    // fir sign in
    builder.addCase(signInUser.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.success = true;
      const createLocalObject = {
        success: true,
        userInfo: action.payload
      };
      localStorage.setItem("userInfo", JSON.stringify(createLocalObject));
      toast.success("Login Success!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    });
    builder.addCase(signInUser.rejected, (state, action) => {
      state.error = JSON.parse(JSON.stringify(action.payload));
      state.loading = false;
      toast.error(action?.payload?.response?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    });

    // for sign up
    builder.addCase(signUpUser.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      toast.success("Sign up successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
      <Navigate to="/signIn" />;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.error = action?.payload?.response?.data;
      state.loading = false;
      toast.error(action?.payload?.response?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    });

    // for gst verify
    builder.addCase(gstVerify.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(gstVerify.fulfilled, (state, action) => {
      state.loading = false;
      //   state.success = true;
      toast.success("Gst Number is valid!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
      //   <Navigate to="/signIn" />;
    });
    builder.addCase(gstVerify.rejected, (state, action) => {
      state.error = action?.payload?.response?.data;
      state.loading = false;
      toast.error(action?.payload?.response?.data?.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    });
  }
});

export default signUpUserSlice.reducer;
