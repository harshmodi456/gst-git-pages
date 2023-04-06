import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Constant/AxiosInstance";
import { toast } from "react-toastify";
import instance from "../../Constant/AxiosInstance";

// for gst verify
export const gstVerify = createAsyncThunk(
  "user/gstVerify",
  async (data, thunkApi) => {
    try {
      return await (
        // await instance.post(`${api}gst/verify`, data)
        await instance.get(`${api}gst/verify/${data?.verificationValue}?userId=${data?.userId || null }`)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for get gst by user id
export const getGstByUserId = createAsyncThunk(
  "user/getGstByUserId",
  async (userId, thunkApi) => {
    try {
      return await (
        // await instance.post(`${api}gst/verify`, data)
        await instance.get(`${api}gst/user/${userId}`)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for review for my business by user id
export const getReviewForMyBusiness = createAsyncThunk(
  "user/getReviewForMyBusiness",
  async (userId, thunkApi) => {
    try {
      return await (
        // await instance.post(`${api}gst/verify`, data)
        await instance.get(`${api}review/businessReview/${userId}`)
      ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for save gst record based on gst number
export const postGstRecord = createAsyncThunk(
  "Gst/postGstRecord",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.post(`${api}gst/recordGst`, data)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for search by gst number
export const SearchByGstNumber = createAsyncThunk(
  "Gst/SearchByGstNumber",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.get(`${api}gst/searchGst/${data}`)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for get all gst record
export const getAllGstRecord = createAsyncThunk(
  "Gst/getAllGstRecord",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.get(`${api}gst?size=${data.size}?page=${data.page}`)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for get gst record by gst number
export const getRecordGstById = createAsyncThunk(
  "Gst/getRecordGstById",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.get(`${api}gst/${data?.gstIn}?userId=${data.userId}`)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for write review
export const writeReview = createAsyncThunk(
  "Gst/writeReview",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.post(`${api}review/write`, data)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for update review
export const updateReview = createAsyncThunk(
  "Gst/updateReview",
  async (data, thunkApi) => {
    try {
      return await
        (
          await instance.post(`${api}review/update`, data)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for get write review by id
export const getWriteReview = createAsyncThunk(
  "Gst/getWriteReview",
  async (data, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.get(
            `${api}review/${data?.gstId}${data?.address ? `?address=${data?.address}` : ""
            }?size=${30}`
          )
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for get write review by id
export const getReviewByUser = createAsyncThunk(
  "Gst/getReviewByUser",
  async (userId, thunkApi) => {
    try {
      return await // await doFetch(`${api}/auth/login`,'POST',data)
        // await axios.get(`${api}gst/getGst/${data}`)
        (
          await instance.get( // ---- testing
            `${api}review/user/${userId}?size=30`
          )
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for add helpuful
export const addHelpfulCount = createAsyncThunk(
  "Gst/addHelpful",
  async (data, thunkApi) => {
    try {
      return await
        (
          await instance.post(
            `${api}review/helpful/${data?.reviewId}`, data)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

// for get write review by id
export const updateUser = createAsyncThunk(
  "Get/updateUser",
  async (data, thunkApi) => {
    const user = JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.data;
    try {
      return await
        (
          await instance.post(`${api}users/update/${user?._id}`, data)
        ).data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: false,
  gstInfo: {},
  reviewData: {},
  error: {},
  success: false,
};

const SearchGstNumber = createSlice({
  name: "Gst",
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    // for gst verify
    builder.addCase(gstVerify.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(gstVerify.fulfilled, (state, action) => {
      state.loading = false;

      // let isValid =
      //   typeof action?.payload.data === "object" &&
      //   action?.payload.data !== null;

      if (action?.payload?.status === true) {
        // toast.success("Gst number or name is valid!", {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
      } else {
        toast.success("Gst number or name is not valid!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      // if (!isValid) {
      //   toast.success("Gst Number is valid!", {
      //     position: "top-right",
      //     autoClose: 2000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light"
      //   });
      // }
    });
    builder.addCase(gstVerify.rejected, (state, action) => {
      state.error = action?.payload?.response?.data;
      state.loading = false;
    });

    // for post gst record
    builder.addCase(postGstRecord.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(postGstRecord.fulfilled, (state, action) => {
      state.gstInfo = action.payload;
      state.loading = false;
      state.success = true;
      // toast.success(action?.payload?.message, {
      //   position: "top-right",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
    });
    builder.addCase(postGstRecord.rejected, (state, action) => {
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
        theme: "light",
      });
    });

    // for search by gst number
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

    // for get all saved gst record
    builder.addCase(getAllGstRecord.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(getAllGstRecord.fulfilled, (state, action) => {
      state.gstInfo = action.payload;
      state.loading = false;
      state.success = true;
    });
    builder.addCase(getAllGstRecord.rejected, (state, action) => {
      state.error = JSON.parse(JSON.stringify(action.payload));
      state.loading = false;
    });

    // for record by gst number
    builder.addCase(getRecordGstById.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(getRecordGstById.fulfilled, (state, action) => {
      state.gstInfo = action.payload;
      state.loading = false;
      state.success = true;
    });
    builder.addCase(getRecordGstById.rejected, (state, action) => {
      state.error = JSON.parse(JSON.stringify(action.payload));
      state.loading = false;
    });

    // for write review
    builder.addCase(writeReview.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(writeReview.fulfilled, (state, action) => {
      state.reviewData = action.payload;
      state.loading = false;
      state.success = true;
      toast.success("Review added successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
    builder.addCase(writeReview.rejected, (state, action) => {
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
        theme: "light",
      });
    });

    // for update review
    builder.addCase(updateReview.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(updateReview.fulfilled, (state, action) => {
      state.reviewData = action.payload;
      state.loading = false;
      state.success = true;
      toast.success("Review updated successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
    builder.addCase(updateReview.rejected, (state, action) => {
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
        theme: "light",
      });
    });

    // for get write review by id
    builder.addCase(getWriteReview.pending, (state, action) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(getWriteReview.fulfilled, (state, action) => {
      state.reviewData = action.payload;
      state.loading = false;
      state.success = true;
    });
    builder.addCase(getWriteReview.rejected, (state, action) => {
      state.error = JSON.parse(JSON.stringify(action.payload));
      state.loading = false;
    });
  },
});

export default SearchGstNumber.reducer;
