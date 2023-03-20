import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Rating,
  TextField
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import SearchImg from "../../Assets/Images/img2.png";
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
import moment from "moment/moment";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "react-select";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const GstInformation = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [getFormValue, setFormValue] = React.useState("");
  const [reviewTextDesc, setReviewTextDesc] = React.useState("");
  // const [gstDbId, setGstDbId] = React.useState("");
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
  // let businessAddress = [];
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
  }, [gst])
  // useEffect(() => {
  //   isLoading(true);
  //   dispatch(getRecordGstById(params.gstNumber)).then((res) => {
  //     if (res?.payload?.data) {
  //       setFormValue(res?.payload?.data);
  //       setAddressData(res?.payload?.data?.gstData?.adadr);
  //       const request = {
  //         gstId: res?.payload?.data?._id
  //       };
  //       dispatch(getWriteReview(request)).then((res) => {
  //         setReviewData(res?.payload?.reviews);
  //       });
  //     }
  //     isLoading(false);
  //   });
  // }, []);

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
        gstId: gst?._id,
        address: takeItems.value
      };
      try {
        dispatch(getWriteReview(request)).then((res) => {
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
          dispatch(getWriteReview(getFormValue._id)).then((res) => {
            setReviewData(res?.payload?.reviews);
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

  return (
    <div className="form-searchGstInformation">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        container
        spacing={{ xs: 0, md: 3 }}
        columns={{ xs: 0, sm: 8, md: 12 }}
      // mt={0px}
      >
        <Grid item xs={4} className="grid-first">
          <img src={SearchImg} alt="SearchImg" />
        </Grid>
        <Grid item xs={4} md={5}>
          <Card sx={{ width: 450 }}>
            <CardHeader
              title="GST Information"
              className="card-header text-center"
            />
            <CardContent>
              <Formik
                initialValues={formInitialValues}
                // validationSchema={validationSchema}
                // onSubmit={(values) => searchGstHandler(values)}
                enableReinitialize={true}
              >
                {(props) => (
                  <Form>
                    <div className="form-group">
                      <label>Trade Name</label>
                      <Field
                        name="name"
                        type="text"
                        component={CustomTextField}
                        id="name"
                        placeholder="Name"
                        variant="outlined"
                        className="form-control-textFiled"
                        disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <label>Business Name</label>
                      <Field
                        name="businessName"
                        type="text"
                        component={CustomTextField}
                        id="businessName"
                        placeholder="Business Name"
                        variant="outlined"
                        className="form-control-textFiled"
                        disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label><br />
                      <Field
                        name="address"
                        id="address"
                        placeholder="Address"
                        variant="outlined"
                        className="form-control-select"
                        as="select"
                        onChange={(e) => onFilterHandler(e.target.value)}
                      >
                        {businessAddress &&
                          (
                            businessAddress?.map((address, index) => {
                              return (
                                <option key={index} value={address?.bnm}>{address?.bnm}</option>
                              )
                            })
                          )
                        }
                      </Field>
                      {/* <Field
                        name="address"
                        type="text"
                        // component={CustomTextField}
                        render={(props) => (
                          <FormControl>
                            <Select
                              isClearable={true}
                              className="basic-single"
                              classNamePrefix="select"
                            // options={businessAddress}
                            // onChange={(items) => onFilterHandler(items?.bnm)}
                            />
                          </FormControl>
                        )}
                        id="address"
                        placeholder="Address"
                        variant="outlined"
                        className="form-control-textFiled"
                        disabled={true}
                      /> */}
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="w-100 mt-4 mb-3 footer-div">
                <div className="text-feedback mr-4">Feedback</div>
                <button
                  className="btn"
                  onClick={handleClickOpen}
                  disabled={selectedAddress ? false : true}
                >
                  Write Review
                </button>
              </div>
              {/* <div className="rate-div-main">
                <div className="start-rate-title">Click The Star To Rate</div>
                <div className="rate-view">
                  <label className="num-review mr-2">2.0 </label>
                  <Rating
                    name="simple-controlled"
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    size="large"
                  />
                  <label className="num-review ml-2"> {value} Reviews</label>
                </div>
              </div> */}
              <div className="footer-card-view mt-3">
                {getReviewData?.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "black"
                    }}
                  >
                    Data not found!
                  </div>
                ) : (
                  getReviewData?.map((items, index) => (
                    <Card sx={{ maxWidth: 345 }} key={index}>
                      <CardHeader
                        action={
                          <IconButton
                            aria-label="settings"
                            onClick={() => {
                              setOpen(true);
                              setIsEditable(true);
                              setValue(items?.rating);
                              setReviewTextDesc(items?.reviewText);
                              setModalObject(items);
                            }}
                            disabled={selectedAddress ? false : true}
                          >
                            <EditIcon />
                          </IconButton>
                        }
                        title={items?.address}
                        subheader={moment(items?.updatedAt).format(
                          "MMMM d, YYYY"
                        )}
                      />
                      <CardContent>
                        <div className="text-aria">
                          <textarea className="textarea-cls">
                            {items?.reviewText}
                          </textarea>
                          {/* <IconButton
                            aria-label="settings"
                            onClick={() => {
                              setOpen(true);
                              setValue(items?.rating);
                              setReviewTextDesc(items?.reviewText);
                            }}
                            disabled={selectedAddress ? false : true}
                          >
                            <EditIcon />
                          </IconButton> */}
                        </div>
                        <div className="rate-view">
                          <Rating
                            name="simple-controlled"
                            value={items?.rating}
                            disabled={true}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div className="dialog-view">
        <Dialog
          // open={open}
          open={true}
          onClose={(event, reason) => {
            if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
              handleClose();
            }
          }}
          PaperProps={{
            sx: {
              width: "100%"
            }
          }}
          disableEscapeKeyDown={true}
          disableBackdropClick={true}
        >
          <DialogTitle id="alert-dialog-title">
            <Title>{getFormValue?.gstData?.lgnm || "Bharat Info"}</Title>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className="rate-view">
                <Rating
                  name="simple-controlled"
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  size="large"
                />
              </div>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              type="text"
              placeholder="Share Details Of Your Own Experience At This Place"
              fullWidth
              variant="outlined"
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
              <img src={profileImg} height={'50px'}/>
              <Button onClick={upload} className="mt-3" variant="outlined" startIcon={<CameraAltIcon />}>
                Add Image
              </Button>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handlePost}>Post</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default GstInformation;
