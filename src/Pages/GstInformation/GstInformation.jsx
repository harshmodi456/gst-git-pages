import {
  Button,
  Rating,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import "./GstInformation.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  getRecordGstById,
  getWriteReview,
  updateReview,
  writeReview,
  gstVerify
} from "../../Redux/Reducers/SearchGstNumReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReviewCard from "../../Components/ReviewCard/ReviewCard";

const GstInformation = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [getFormValue, setFormValue] = React.useState("");
  const [reviewTextDesc, setReviewTextDesc] = React.useState("");
  const [getReviewData, setReviewData] = React.useState([]);
  const [addressData, setAddressData] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState("");
  const [loading, isLoading] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(false);
  const [modalObject, setModalObject] = React.useState("");
  const getUserToken = JSON.parse(localStorage.getItem("userInfo"));
  const pathArray = (location.pathname).split('/');
  const gstIn = pathArray[2] || null;
  const [gst, setGst] = useState({});
  const [businessAddress, setBusinessAddress] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [profileImg, setProfileImg] = useState([]);

  useEffect(() => {
    isLoading(true);
    dispatch(gstVerify(gstIn)).then((res) => {
      if (res?.payload?.status === true) {
        setGst(res?.payload?.data[0]);

        if (res?.payload?.data[0]?.adadr || res?.payload?.data[0]?._doc?.gstData?.adadr) {
          (res?.payload?.data[0]?.adadr || res?.payload?.data[0]?._doc?.gstData?.adadr)?.map((addr) => {
            if (businessAddress?.length > 0) {
              businessAddress?.map((availableAddr) => {
                if (availableAddr !== addr) {
                  setBusinessAddress([addr?.addr, ...businessAddress]);
                }
              })
            } else {
              setBusinessAddress([addr?.addr, ...businessAddress]);
            }
          })
        }

        if (Array.isArray(res?.payload?.data[0]?.pradr || res?.payload?.data[0]?._doc?.gstData?.pradr)) {
          (res?.payload?.data[0]?.pradr || res?.payload?.data[0]?._doc?.gstData?.pradr)?.map((addr) => {
            if (businessAddress?.length > 0) {
              businessAddress?.map((availableAddr) => {
                if (availableAddr !== addr) {
                  setBusinessAddress([addr?.addr, ...businessAddress]);
                }
              })
            } else {
              setBusinessAddress([addr?.addr, ...businessAddress]);
            }
          })
        } else {
          setBusinessAddress([res?.payload?.data[0]?.pradr?.addr || res?.payload?.data[0]?._doc?.gstData?.pradr?.addr, ...businessAddress])
        }
      } else {
        setGst({});
      }
      isLoading(false);
    });
  }, [])

  useEffect(() => {
    setSelectedAddress(gst?.pradr?.addr?.bnm || gst?._doc?.gstData?.pradr?.addr?.bnm)

    isLoading(true);
    dispatch(getRecordGstById(params.gstNumber)).then((res) => {
      if (res?.payload?.data) {
        setFormValue(res?.payload?.data);
        setAddressData(res?.payload?.data?.gstData?.adadr);
        const request = {
          gstId: gst?._id || gst?._doc?._id,
          address: businessAddress[0]
        };
        dispatch(getWriteReview(request)).then((res) => {
          setReviewData(res?.payload?.reviews);
        });
      }
      isLoading(false);
    });
  }, [gst])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditable(false);
    setValue("");
    setReviewTextDesc("");
  };

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file != null) {
      setProfileImg(URL.createObjectURL(file));
      setImgFile(file);
    }
  }

  const upload = () => {
    document.getElementById("reviewImgUrl").click()
  }

  const onFilterHandler = (takeItems) => {
    isLoading(true);
    setSelectedAddress(takeItems);
    if (takeItems) {
      const request = {
        gstId: gst?._id || gst?._doc?._id,
        address: takeItems.value
      };
      try {
        dispatch(getWriteReview(request)).then((res) => {
          console.log('----------', res?.payload?.reviews)
          setReviewData(res?.payload?.reviews);
          isLoading(false);
        });
      } catch (error) {
        isLoading(false);
      }
    } else {
      const request = {
        gstId: gst?._id
      };
      try {
        dispatch(getWriteReview(request)).then((res) => {
          setReviewData(res?.payload?.reviews);
          isLoading(false);
        });
      } catch (error) {
        isLoading(false);
      }
    }
  };

  const Title = ({ children }) => (
    <div className="title" style={{ color: "#2a2829", fontSize: "21px" }}>
      {children}
      {/* <div className="subtitle" style={{ color: "#747474", fontSize: "14px" }}>
        Posting Publicly
      </div> */}
    </div>
  );

  const handlePost = () => {
    const writeReviewInput = {
      userId: getUserToken?.userInfo?.data?._id,
      gstId: gst?._id || gst?._doc?._id,
      address: selectedAddress,
      reviewText: reviewTextDesc,
      rating: value
    };
    if (isEditable) {
      const updateReviewInput = {
        _id: modalObject._id,
        address: selectedAddress,
        reviewText: reviewTextDesc,
        rating: value
      };
      dispatch(updateReview(updateReviewInput)).then((res) => {
        if (res?.payload?.status === true) {
          handleClose();
          isLoading(true);
          dispatch(getWriteReview(res?.payload?.data)).then((res) => {
            console.log("res?.payload?.data", res?.payload?.reviews);
            setReviewData(res?.payload?.reviews);
            isLoading(false);
          });
        }
      });
    } else {
      dispatch(writeReview(writeReviewInput)).then((res) => {
        if (res?.payload?.status === true) {
          handleClose();
          isLoading(true);
          dispatch(getWriteReview(gst._id || gst?._doc?._id)).then((res) => {
            setReviewData(res?.payload?.reviews);
            document.getElementById("btn-cancel").click();
            isLoading(false);
          });
        }
      });
    }
  };

  const formInitialValues = {
    name: gst?.tradeNam || gst?._doc?.gstData?.tradeNam,
    businessName: gst?.lgnm || gst?._doc?.gstData?.lgnm,
    address: gst?.pradr?.addr?.bnm || gst?._doc?.gstData?.pradr?.addr?.bnm
  };

  const addressOptions = useMemo(
    () =>
      addressData?.map((item) => {
        return {
          ...item,
          label: item.addr.bnm,
          value: item.addr.bnm
        };
      }),
    [addressData]
  );

  console.log(gst)

  return (
    <div className="gst-information-container">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="gst-information m-lg-5 px-lg-5 px-4 py-2">
        <h3 className="title m-0">Search Result based on GSTIN/UIN : {gst?.gstin || gst?._doc?.gstin}</h3>
        <div className="row pt-2 pb-5 px-lg-3 bg-gray">
          <div className="col-md-4 col-12">
            <h5 className="font-weight-bold break-line-1">Legal Name of Business</h5>
            <h5 className="value break-line-1">{gst?.lgnm || gst?._doc?.gstData?.lgnm}</h5>
          </div>
          <div className="col-md-4 col-12 pt-md-0 pt-3">
            <h5 className="font-weight-bold break-line-1">Trade Name</h5>
            <h5 className="value break-line-1">{gst?.tradeNam || gst?._doc?.gstData?.tradeNam}</h5>
          </div>
          <div className="col-md-4 col-12 pt-md-0 pt-3">
            <h5 className="font-weight-bold break-line-1">Effective Date of registration</h5>
            <h5 className="break-line-1">{gst?.rgdt || gst?._doc?.gstData?.rgdt}</h5>
          </div>
        </div>
        <div className="row pt-2 pb-5 px-lg-3">
          <div className="col-md-4 col-12">
            <h5 className="font-weight-bold break-line-1">Constitution of Business</h5>
            <h5 className="break-line-1">{gst?.ctb || gst?._doc?.gstData?.ctb}</h5>
          </div>
          <div className="col-md-4 col-12 pt-md-0 pt-3">
            <h5 className="font-weight-bold break-line-1">GSTIN / UIN Status</h5>
            <h5 className="break-line-1">{gst?.sts || gst?._doc?.gstData?.sts}</h5>
          </div>
          <div className="col-md-4 col-12 pt-md-0 pt-3s">
            <h5 className="font-weight-bold break-line-1">Taxpayer Type</h5>
            <h5 className="break-line-1">{gst?.dty || gst?._doc?.gstData?.dty}</h5>
          </div>
        </div>
        <div className="row pt-2 pb-5 px-lg-3 bg-gray">
          <div className="col-md-4 col-12">
            <h5 className="font-weight-bold break-line-1">Administrative Office</h5>
            <h5 className="break-line-1">{gst?.ctb || gst?._doc?.gstData?.ctb}</h5>
          </div>
          <div className="col-md-4 col-12 pt-md-0 pt-3">
            <h5 className="font-weight-bold break-line-1">Other Office</h5>
            <h5 className="break-line-1">{gst?.sts || gst?._doc?.gstData?.sts}</h5>
          </div>
          <div className="col-md-4 col-12 pt-md-0 pt-3">
            <h5 className="font-weight-bold break-line-1">Principal Place of Business</h5>
            <h5 className="break-line-1">{gst?.dty || gst?._doc?.gstData?.dty}</h5>
          </div>
        </div>

        <div className="feedback-container p-lg-5">
          <p className="title m-0 pb-0">Feedback</p>
          <div className="d-flex justify-content-center align-items-center">
            <p className="m-0 pr-3 lbl-review">REVIEW</p>
            <p className="m-0 mr-2">{Math.round(gst?.avgRating || 0).toFixed(1)}</p>
            <Rating
              className="mt-1"
              name="simple-controlled"
              value={Math.round(gst?.avgRating).toFixed(1)}
              disabled={true}
            />
            <p className="m-0 ml-2 text-muted">({gst?.totalReview || 0})</p>
          </div>
          <div className="text-right">
            <button className="btn-write-review" data-toggle="modal" data-target="#write-review-modal">
              <FaEdit /> Write Review
            </button>
          </div>

          <div className="row review-container p-md-5">
            {
              getReviewData?.length > 0 ? (
                getReviewData?.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))
              ) : (
                <div className="text-muted text-center">
                  <h3>No reviews</h3>
                </div>
              )
            }
          </div>
        </div>

        {/* <!-- Modal --> */}
        <div className="modal fade" data-keyboard={true} tabindex="-1" id="write-review-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content p-5">
              <div className="write-review-title">
                <h2>{gst?.lgnm || gst?._doc?.gstData?.lgnm}</h2>
                <p className="text-muted">Posting Publicity</p>
              </div>
              <div className="rate-view">
                <Rating
                  className="mt-1 mb-4"
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  size="large"
                />
              </div>
              <textarea
                className="review-textarea"
                as='textarea'
                autoComplete="off"
                rows={6}
                placeholder="Write Review..."
                value={reviewTextDesc}
                onChange={(event) => {
                  setReviewTextDesc(event.target.value);
                }}
              />
              <div className="img-container">
                <input
                  id="reviewImgUrl"
                  name='reviewImgUrl'
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={(event) => fileChangeHandler(event)}
                />
                <img src={profileImg} height={'50px'} />
                <Button onClick={upload} className="mt-3" variant="outlined" startIcon={<CameraAltIcon />}>
                  Add Image
                </Button>
              </div>
              <div className="btn-container text-right w-100">
                <button id="btn-cancel" className="btn-cancel mr-3" data-toggle="modal" data-target="#write-review-modal">Cancel</button>
                <button className="btn-submit" onClick={handlePost}>Post</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GstInformation;
