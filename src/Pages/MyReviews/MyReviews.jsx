import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import gstData from "../../Constant/GstData.json";
import "./MyReviews.scss";
import CommonGstList from "../../Components/CommonGstList/CommonGstList";
import {
  getReviewByUser
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import Review from "../../Components/ReviewList/Review";

const MyReviews = () => {

  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(0);
  const user = localStorage.getItem('userInfo');
  const userId = JSON.parse(user)?.userInfo?.data?._id;
  const [reviewData, setReviewData] = React.useState([]);

  React.useEffect(() => {
    dispatch(getReviewByUser(userId)).then((res) => {
      setReviewData(res?.payload?.reviews);
    });
  })

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="my-reviews-div">
      <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
        <div className="main-div container">
          <h5>My Reviews</h5>
          <Box sx={{ width: "100%" }}>
            <Review reviewList={reviewData} />
          </Box>
        </div>
      </Grid>
    </div>
  );
};

export default MyReviews;
