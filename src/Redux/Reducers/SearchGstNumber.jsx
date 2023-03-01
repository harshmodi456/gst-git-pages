import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../Constant/AxiosInstance";

// for sign in action and state declaration
export const SearchByGstNumber = createAsyncThunk(
  "Gst/SearchByGstNumber",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
      (
        await axios.get(`${api}gst/getGst/${data}`)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  gstInfo: {},
  error: {},
  success: false
};

const SearchGstNumber = createSlice({
  name: "Gst",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    // fir sign in
    builder.addCase(SearchByGstNumber.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(SearchByGstNumber.fulfilled, (state, action) => {
      state.gstInfo = action.payload;
      state.loading = false;
      state.success = true;
    });
    builder.addCase(SearchByGstNumber.rejected, (state, action) => {
      state.error = JSON.parse(JSON.stringify(action.payload));
      state.loading = false;
    });
  }
});

export default SearchGstNumber.reducer;
