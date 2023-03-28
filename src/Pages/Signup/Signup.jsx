import React, { useState } from "react";
import "./Signup.scss";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
// import TextField from '@mui/material/TextField';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
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
  Grid
} from "@mui/material";
import loginImg from "../../Assets/Images/img2.png";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  sendOtpUser,
  signUpUser,
  userVerifyWithOtp
} from "../../Redux/Reducers/SignInUpReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import OtpViewComponents from "../../Components/OtpViewComponents/OtpViewComponents";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConPassword, setShowConPassword] = React.useState(false);
  const [isLoadingOtpContainer, setIsLoadingOtpContainer] = useState(false);
  const [loading, isLoading] = React.useState(false);
  const [formValues, setFormValues] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  const handleClickOpen = (takeRecord) => {
    setOpen(true);
    dispatch(sendOtpUser(takeRecord?.data?._id));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validationSchema = Yup.object({
    mobileNo: Yup.string()
      .min(10, "Mobile number must be a 10 digits")
      .max(10, "Mobile number must be a 10 digits")
      .required("Mobile number Number is Required."),
    userPassword: Yup.string()
      .required("Password is required")
      .min(5, "Your password is too short.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("userPassword"), null], "Passwords must match")
      .required("Confirm Password is required")
  });

  const signupHandler = (takeValue) => {
    isLoading(true);
    dispatch(
      signUpUser({
        mobileNo: takeValue?.mobileNo?.toString(),
        password: takeValue?.userPassword,
        passwordConfirm: takeValue?.confirmPassword
      })
    ).then((res) => {
      if (res?.payload?.status === true) {
        handleClickOpen(res?.payload);
        setFormValues(res?.payload);
      }
      isLoading(false);
    });
  };

  const otpSubmitHandler = () => {
    setIsLoadingOtpContainer(true);
    const request = {
      userId: formValues?.data?._id,
      otp: otp
    };
    dispatch(userVerifyWithOtp(request)).then((res) => {
      if (res?.payload?.status === true) {
        navigate('/login')
      } else {
        setTimeout(() => {
          setIsLoadingOtpContainer(false);
        }, [500])
      }
    });
  };

  console.log('isLoadingOtpContainer', isLoadingOtpContainer)

  return (
    <div className="form-signup">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="form-card">
        <Grid
          container
          spacing={{ xs: 0, md: 3 }}
          columns={{ xs: 0, sm: 8, md: 12 }}
        >
          <Grid item xs={4} className="grid-first">
            <img src={loginImg} alt="sign up" />
          </Grid>
          <Grid item xs={4} md={5}>
            <Card sx={{ width: 450 }}>
              <CardHeader title="Sign Up" className="card-header text-center" />
              <CardContent className="mt-2">
                <Formik
                  initialValues={{
                    mobileNo: "",
                    userPassword: "",
                    confirmPassword: ""
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    signupHandler(values);
                  }}
                >
                  <Form>
                    <div className="form-group">
                      <Field
                        name="mobileNo"
                        type="number"
                        component={CustomTextField}
                        id="mobileNo"
                        label="Mobile Number"
                        variant="outlined"
                        className="form-control-textFiled"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        name="userPassword"
                        type={showPassword ? "text" : "password"}
                        component={CustomTextField}
                        id="password"
                        label="Password"
                        variant="outlined"
                      />
                      {
                        showPassword ? (
                          <FaEyeSlash
                            size={25}
                            className="password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <FaEye
                            size={25}
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-icon"
                          />
                        )
                      }
                    </div>
                    <div className="form-group">
                      <Field
                        name="confirmPassword"
                        type={showConPassword ? "text" : "password"}
                        component={CustomTextField}
                        id="password"
                        label="Confirm Password"
                        variant="outlined"
                      />
                      {
                        showConPassword ? (
                          <FaEyeSlash
                            size={25}
                            className="password-icon"
                            onClick={() => setShowConPassword(!showConPassword)}
                          />
                        ) : (
                          <FaEye
                            size={25}
                            onClick={() => setShowConPassword(!showConPassword)}
                            className="password-icon"
                          />
                        )
                      }
                    </div>
                    <label className="tandc-checkbox d-flex align-items-center justify-content-center">
                        <input type="checkbox" className="mr-3" />
                        <p className="m-0">
                          By clicking, I accept the<a href="/"> terms of the service</a> and <a href="/">privacy policy</a>
                        </p>
                      </label>
                    <div className="w-50">
                      <button className="w-100 btn btn-lg btn-primary">
                        Sign Up
                      </button>
                    </div>

                    <div className="mt-3 account-signup">
                      <span style={{ color: "#27489f" }}>
                        Already have an account?
                      </span>{" "}
                      &nbsp;{" "}
                      <Link to="/login" className="have-account">
                        Login
                      </Link>
                    </div>
                  </Form>
                </Formik>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            // Set 'open' to false, however you would do that with your particular code.
            handleClose();
          }
        }}
        PaperProps={{
          sx: {
            width: "100%"
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <div className="text-center mt-2 mb-4">{"Otp verification"}</div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Backdrop
              open={isLoadingOtpContainer}
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <OtpViewComponents handleChange={(evt) => setOtp(evt)} otp={otp} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => otpSubmitHandler()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Signup;
