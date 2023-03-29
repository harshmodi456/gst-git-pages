import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./MyReviews.scss";
import {
  getReviewByUser,
  getReviewForMyBusiness
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import ReviewCard from "../../Components/ReviewCard/ReviewCard";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SendIcon from '@mui/icons-material/Send';

const MyReviews = () => {

  const dispatch = useAppDispatch();
  const user = localStorage.getItem('userInfo');
  const userId = JSON.parse(user)?.userInfo?.data?._id;
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [receiveReviewData, setReceiveReviewData] = useState([]);
  const [alignment, setAlignment] = useState('send');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const fetchMyReviews = () => {
    setIsLoading(true);
    dispatch(getReviewByUser(userId)).then((res) => {
      setReviewData(res?.payload?.reviews);
      setIsLoading(false);
    });
  }

  const fetchMyBusinessReviews = () => {
    setIsLoading(true);
    dispatch(getReviewForMyBusiness(userId)).then((res) => {
      setReceiveReviewData(res?.payload?.reviews);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    fetchMyReviews();
    fetchMyBusinessReviews();
  }, [])

  return (
    <div className="my-review-container py-5 px-lg-5 px-md-3">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="title-container d-flex justify-content-start align-items-center">
        <h2 className="font-weight-bold pl-lg-5 pl-3">
          My Review
        </h2>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
          className="ml-5"
        >
          <ToggleButton value="send">Send <SendIcon className="ml-3" /></ToggleButton>
          <ToggleButton value="receive">Receive</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="row p-md-5">
        {
          alignment === 'receive' ? (
            <>
              {
                receiveReviewData?.length > 0 ? (
                  receiveReviewData?.map((review, index) => (
                    <ReviewCard key={index} review={review} updateData={fetchMyReviews} />
                  ))
                ) : (
                  <div className="text-muted text-center w-100">
                    <h3>No reviews</h3>
                  </div>
                )
              }
            </>
          ) : (
            <>
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
            </>
          )
        }
      </div>
    </div>
  );
};

export default MyReviews;
