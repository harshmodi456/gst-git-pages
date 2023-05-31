import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import { useFormik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import "./MyReviews.scss";
import {
  getReviewByUser,
  getReviewForMyBusiness,
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import ReviewCard from "../../Components/ReviewCard/ReviewCard";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SendIcon from "@mui/icons-material/Send";
import { FormControl, MenuItem, Select } from "@mui/material";
import { DebounceInput } from 'react-debounce-input';

const MyReviews = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [receiveReviewData, setReceiveReviewData] = useState([]);
  const [alignment, setAlignment] = useState("send");
  const [userId, setUserId] = useState("");
  const [selectMenu, setSelectMenu] = useState('');
  const [inputField, setinputField] = useState('');

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let token = userInfo?.userInfo?.token
  useEffect(() => {
    if (userInfo?.userInfo?.data?._id) {
      setUserId(userInfo.userInfo.data._id);
    }
  }, []);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const fetchMyReviews = () => {
    if (alignment === "send") {
      setIsLoading(true);
      dispatch(getReviewByUser({ userId })).then((res) => {
        setReviewData(res?.payload?.reviews);
        setIsLoading(false);
      });
    }
  };

  const fetchMyBusinessReviews = () => {
    if (alignment === "receive") {
      setIsLoading(true);
      dispatch(getReviewForMyBusiness({ userId })).then((res) => {
        setReceiveReviewData(res?.payload?.reviews);
        setIsLoading(false);
      });
    }
  };
  useEffect(() => {
    if (userId) {
      setSelectMenu('')
      setinputField('')
      fetchMyReviews();
      fetchMyBusinessReviews();
    }
  }, [userId, alignment]);

  const submitHandler = (values, isFormSubmit, { resetForm }) => {
    const params = {
      companyName: values?.companyName === "" ? "" : values?.companyName,
      orderByRating: values?.orderByRating === "" ? "" : values?.orderByRating,
    };
    setSearchValue(params?.verificationValue);
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

  const handleChangeDebounce = (e) => {
    if (e.target.name === "orderByRating") {
      setSelectMenu(e.target.value)
    } else {
      setinputField(e.target.value)
    }
    const params = {
      [e.target.name]: e.target.value,
    };
    setSearchValue(params?.verificationValue);
    if (alignment === "send") {
      setIsLoading(true);
      dispatch(getReviewByUser({ userId, params })).then((res) => {
        setReviewData(res?.payload?.reviews);
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      
      dispatch(getReviewForMyBusiness({ userId, params, token })).then((res) => {
        setReceiveReviewData(res?.payload?.reviews);
        setIsLoading(false);
      });
    }

  }
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
          className="ml-5">
          <ToggleButton value="send">Send <SendIcon className="ml-3" /></ToggleButton>
          <ToggleButton value="receive">Receive</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="mt-4">
        <div className="filter-Conatiner" style={{ textAlign: "right" }} >
          <DebounceInput placeholder="ENTER COMPANY NAME" name="companyName" variant="standard" autoComplete="off"
            size="small" onChange={(e) => handleChangeDebounce(e)} debounceTimeout={1500} value={inputField}
            className="search-bar p-2" />
          <FormControl sx={{ width: "auto" }} size="small">
            <Select
              id="orderByRating"
              name="orderByRating"
              className="filterDropdown"
              displayEmpty
              value={selectMenu}
              onChange={(e) => handleChangeDebounce(e)}
            >
              <MenuItem value="">Select The Options</MenuItem>
              <MenuItem value="Ascending">Ascending</MenuItem>
              <MenuItem value="Descending">Descending</MenuItem>
            </Select>
          </FormControl>
          {formik.errors.companyName && (
            <div>
              <span style={{ color: "red" }}>
                {formik.errors.companyName}
              </span>
            </div>
          )}
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
