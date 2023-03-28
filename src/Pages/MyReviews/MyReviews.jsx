import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./MyReviews.scss";
import {
  getReviewByUser
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import ReviewCard from "../../Components/ReviewCard/ReviewCard";

const MyReviews = () => {

  const dispatch = useAppDispatch();
  const user = localStorage.getItem('userInfo');
  const userId = JSON.parse(user)?.userInfo?.data?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = React.useState([]);

  const fetchMyReviews = () => {
    setIsLoading(true);
    dispatch(getReviewByUser(userId)).then((res) => {
      setReviewData(res?.payload?.reviews);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    fetchMyReviews();
  }, [])

  return (
    <div className="my-review-container py-5 px-lg-5 px-md-3">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="">
        <h2 className="font-weight-bold pl-lg-5 pl-3">
          My Review
        </h2>
      </div>
      <div className="row p-md-5">
        {
          reviewData?.length > 0 ? (
            reviewData?.map((review, index) => (
              <ReviewCard key={index} review={review} updateData={fetchMyReviews} />
            ))
          ) : (
            <div className="text-muted text-center w-100">
              <h3>No reviews</h3>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default MyReviews;
