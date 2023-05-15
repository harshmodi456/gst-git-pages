import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import { useFormik } from "formik";
import * as Yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import "./MyReviews.scss";
import {
  getReviewByUser,
  getReviewForMyBusiness,
  FilterReviewByUser,
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import ReviewCard from "../../Components/ReviewCard/ReviewCard";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SendIcon from "@mui/icons-material/Send";

const MyReviews = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // const user = localStorage.getItem('userInfo');
  const [searchValue, setSearchValue] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [receiveReviewData, setReceiveReviewData] = useState([]);
  const [alignment, setAlignment] = useState("send");
  // const takeUserInfo = localStorage.getItem("userInfo");
  // const getUserInfo = JSON.parse(takeUserInfo);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.userInfo?.data?._id) {
      setUserId(userInfo.userInfo.data._id);
    }
  }, []);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const fetchMyReviews = () => {
    setIsLoading(true);
    dispatch(getReviewByUser({ userId })).then((res) => {
      setReviewData(res?.payload?.reviews);
      setIsLoading(false);
    });
  };
  const fetchMyBusinessReviews = () => {
    setIsLoading(true);
    dispatch(getReviewForMyBusiness({ userId })).then((res) => {
      setReceiveReviewData(res?.payload?.reviews);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    if (userId) {
      fetchMyReviews();
      fetchMyBusinessReviews();
    }
  }, [userId]);

  const submitHandler = (values, isFormSubmit, { resetForm }) => {
    const params = {
      companyName: values?.companyName === "" ? "" : values?.companyName,
      orderByRating: values?.orderByRating === "" ? "" : values?.orderByRating,
    };
    setSearchValue(params?.verificationValue);
    dispatch(getReviewByUser({ userId, params })).then((res) => {
      if (isFormSubmit) {
        setReviewData(res?.payload?.reviews);
        setIsLoading(false);
      }
    });
    dispatch(getReviewForMyBusiness({ userId, params })).then((res) => {
      if (isFormSubmit) {
        setReceiveReviewData(res?.payload?.reviews);
        setIsLoading(false);
      }
    });
  };
  const formik = useFormik({
    initialValues: {
      companyName: "",
      orderByRating: "",
    },
    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);
      submitHandler(values, true, { resetForm });
    },
  });
  return (
    <div className="my-review-container py-5 px-lg-5 px-md-3">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="title-container">
        <h2 className="font-weight-bold pl-lg-5 pl-3">My Review</h2>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          className="ml-5"
        >
          <ToggleButton value="send">
            Send <SendIcon className="ml-3" />
          </ToggleButton>
          <ToggleButton value="receive">Receive</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div class="mt-4">
        <div className="filter-Conatiner" style={{ textAlign: "right" }}>
          <form onSubmit={formik.handleSubmit}>
            <input
              autoComplete="off"
              className="search-bar"
              id="companyName"
              name="companyName"
              placeholder="Enter your company name"
              onChange={formik.handleChange}
              value={formik.values.companyName}
            />
            <select
              id="orderByRating"
              name="orderByRating"
              className="filterDropdown"
              value={formik.values.orderByRating}
              onChange={formik.handleChange}
            >
              <option value="" selected>
                Select the option
              </option>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
            <button type="submit" className="btn-search">
              Submit
            </button>
            {formik.errors.companyName && (
              <div>
                <span style={{ color: "red" }}>
                  {formik.errors.companyName}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="row p-md-2">
        {alignment === "receive" && (
          <>
            {receiveReviewData?.length > 0 ? (
              receiveReviewData?.map((review, index) => (
                <ReviewCard
                  key={index}
                  review={review}
                  updateData={fetchMyBusinessReviews}
                  receiveReview={true}
                />
              ))
            ) : (
              <div className="text-muted text-center w-100">
                <h3>No reviews</h3>
              </div>
            )}
          </>
        )}

        {alignment === "send" && (
          <>
            {reviewData?.length > 0 ? (
              reviewData?.map((review, index) => (
                <ReviewCard
                  key={index}
                  review={review}
                  updateData={fetchMyReviews}
                  mySentReview={true}
                />
              ))
            ) : (
              <div className="text-muted text-center w-100">
                <h3>No reviews</h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
