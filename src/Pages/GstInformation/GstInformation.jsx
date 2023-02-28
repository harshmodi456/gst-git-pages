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
import React from "react";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import SearchImg from "../../Assets/Images/img2.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./GstInformation.scss";

const GstInformation = () => {
  const [value, setValue] = React.useState(2);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                initialValues={{
                  gstNumber: ""
                }}
                // validationSchema={validationSchema}
                // onSubmit={(values) => searchGstHandler(values)}
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
                      />
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="w-100 mt-4 mb-3 footer-div">
                {/* <button className="w-100 btn btn-lg btn-primary">
                        Submit
                      </button> */}
                <div className="text-feedback mr-4">Feedback</div>
                <button className="btn" onClick={handleClickOpen}>
                  Write Review
                </button>
              </div>
              <div className="rate-div-main">
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
              </div>
              <div className="footer-card-view mt-3">
                <Card sx={{ maxWidth: 345 }}>
                  <CardHeader
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title="Shrimp and Chorizo Paella"
                    subheader="September 14, 2016"
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      This impressive paella is a perfect party dish and a fun
                      meal to cook together with your guests. Add 1 cup of
                      frozen peas along with the mussels, if you like.
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div className="dialog-view">
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Bharat Info</DialogTitle>
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
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Post</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default GstInformation;
