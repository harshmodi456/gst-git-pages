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
  Grid,
  IconButton,
  Rating,
  TextField,
  Typography
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import SearchImg from "../../Assets/Images/img2.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./GstInformation.scss";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  getRecordGstById,
  getWriteReview,
  writeReview
} from "../../Redux/Reducers/SearchGstNumReducer";
import moment from "moment/moment";

const GstInformation = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [getFormValue, setFormValue] = React.useState("");
  const [reviewTextDesc, setReviewTextDesc] = React.useState("");
  // const [gstDbId, setGstDbId] = React.useState("");
  const [getReviewData, setReviewData] = React.useState([]);

  const getUserToken = JSON.parse(localStorage.getItem("userInfo"));
  let gstDbId = "";
  useEffect(() => {
    dispatch(getRecordGstById(params.gstNumber)).then((res) => {
      setFormValue(res?.payload?.data);
      dispatch(getWriteReview(res?.payload?.data?._id)).then((res) => {
        setReviewData(res?.payload?.reviews);
      });
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      gstId: getFormValue._id,
      reviewText: reviewTextDesc,
      rating: value
    };
    dispatch(writeReview(writeReviewInput)).then((res) => {
      if (res?.payload?.status === true) {
        console.log("res?.payload", res?.payload);
        handleClose();
        dispatch(getWriteReview(getFormValue._id)).then((res) => {
          setReviewData(res?.payload?.reviews);
        });
      }
    });
  };

  const formInitialValues = {
    name: getFormValue?.gstData?.ctb,
    businessName: getFormValue?.gstData?.lgnm,
    address: getFormValue?.gstData?.pradr?.addr?.bnm
  };

  return (
    <div className="form-searchGstInformation">
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
                      <label>Name</label>
                      <Field
                        name="name"
                        type="text"
                        component={CustomTextField}
                        id="name"
                        // label="Name"
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
                        // label="Business Name"
                        placeholder="Business Name"
                        variant="outlined"
                        className="form-control-textFiled"
                        disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <Field
                        name="address"
                        type="text"
                        component={CustomTextField}
                        id="address"
                        // label="Address"
                        placeholder="Address"
                        variant="outlined"
                        className="form-control-textFiled"
                        disabled={true}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="w-100 mt-4 mb-3 footer-div">
                <div className="text-feedback mr-4">Feedback</div>
                <button className="btn" onClick={handleClickOpen}>
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
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        }
                        title={items?.reviewText}
                        subheader={moment(items?.updatedAt).format(
                          "MMMM d, YYYY"
                        )}
                      />
                      <CardContent>
                        <div className="rate-view">
                          {/* <label className="num-review mr-2">2.0 </label> */}
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
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "100%"
              // maxHeight: 300
            }
          }}
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
              // label="Email Address"
              type="text"
              placeholder="Share Details Of Your Own Experience At This Place"
              fullWidth
              variant="outlined"
              onChange={(event) => {
                setReviewTextDesc(event.target.value);
              }}
            />
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
