import React, { useState } from "react";
import "./Signup.scss";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
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
  Grid,
  TextField
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
import signupBackgroung from "../../Assets/Images/login.svg";
import { toast } from "react-toastify";
import { useFormik } from "formik";

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
  const [checkBox, setCheckBox] = React.useState(false);
  const [mobileNoError, setMobileNoError] = React.useState('');
  const [createLocalObjectValue, setCreateLocalObjectValue] = React.useState();

  const handleClickOpen = (takeRecord) => {
    setOpen(true);
    dispatch(sendOtpUser(takeRecord?.data?._id));
  };

  const formik = useFormik({
    initialValues: {
      mobileNo: "",
      userPassword: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      mobileNo: Yup.string()
        .min(10, "Mobile number must be a 10 digits")
        .max(10, "Mobile number must be a 10 digits")
        .required("Mobile number is required."),
      userPassword: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-zA-Z]/, "Password can only contain latin letters."),
      confirmPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .oneOf([Yup.ref("userPassword"), null], "Password must be same")
        .required("Confirm password is required")
    }),
    onSubmit: (values) => {
      if (checkBox) {
        isLoading(true);
        dispatch(
          signUpUser({
            mobileNo: values?.mobileNo?.toString(),
            password: values?.userPassword,
            passwordConfirm: values?.confirmPassword
          })
        ).then((res) => {
          if (res?.payload?.status === true) {
            handleClickOpen(res?.payload);
            setFormValues(res?.payload);
            const createLocalObject = {
              success: true,
              userInfo: res?.payload
            };
            setCreateLocalObjectValue(createLocalObject);
            localStorage.setItem("userInfo", JSON.stringify(createLocalObject));
          } else {
            setMobileNoError(res?.payload?.response?.data?.message);
            isLoading(false);
            setTimeout(()=>{
              setMobileNoError('');
            }, 4000)
          }
          isLoading(false);
        });
      } else if (!checkBox) {
        toast.warning("Please check privacy policy!");
      }
    }
  });

  const handleClose = () => {
    setOpen(false);
  };

  const otpSubmitHandler = () => {
    setIsLoadingOtpContainer(true);
    const request = {
      userId: formValues?.data?._id,
      otp: otp
    };
    dispatch(userVerifyWithOtp(request)).then((res) => {
      if (res?.payload?.status === true) {
        localStorage.setItem("userInfo", JSON.stringify(createLocalObjectValue));
        localStorage.setItem("isNewUser", false);
        navigate("/user-profile");
      } else {
        setTimeout(() => {
          setIsLoadingOtpContainer(false);
        }, [500]);
      }
    });
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="login-container">
          <div className="row m-0 p-0 w-100">
            <div className="col-lg-6 login-img d-flex justify-content-center">
              <img className="pb-5" src={signupBackgroung} alt="background" />
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
              <div className="login-form-container">
                <h3 className="m-0 pt-5 pb-4 font-weight-bold">Signup</h3>
                <div className="form-group">
                  <TextField
                    autoComplete="off"
                    name="mobileNo"
                    type="number"
                    value={formik.values.mobileNo}
                    onChange={formik.handleChange}
                    id="mobileNo"
                    label="Mobile Number"
                    variant="outlined"
                    className="form-control-textFiled"
                  />
                  {
                    <div
                      className="invalid-feedback"
                      style={{ display: "flex" }}
                    >
                      <div className="error">{formik.errors.mobileNo || mobileNoError}</div>
                    </div>
                  }
                </div>
                <div className="form-group">
                  <TextField
                    name="userPassword"
                    value={formik.values.userPassword}
                    onChange={formik.handleChange}
                    type={showPassword ? "text" : "password"}
                    id="userPassword"
                    label="Password"
                    variant="outlined"
                    className="form-control-textFiled"
                  />
                  {showPassword ? (
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
                  )}
                  {
                    <div
                      className="invalid-feedback"
                      style={{ display: "flex" }}
                    >
                      {formik.touched.userPassword &&
                        formik.errors.userPassword && (
                          <div className="error">
                            {formik.errors.userPassword}
                          </div>
                        )}
                    </div>
                  }
                </div>
                <div className="form-group">
                  <TextField
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    type={showConPassword ? "text" : "password"}
                    id="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    className="form-control-textFiled"
                  />
                  {showConPassword ? (
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
                  )}
                  {
                    <div
                      className="invalid-feedback"
                      style={{ display: "flex" }}
                    >
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <div className="error">
                            {formik.errors.confirmPassword}
                          </div>
                        )}
                    </div>
                  }
                </div>
                <label className="tandc-checkbox d-flex align-items-center justify-content-center">
                  <input
                    value={checkBox}
                    onChange={() => setCheckBox(!checkBox)}
                    type="checkbox"
                    className="mr-3"
                  />
                  <p className="m-0">
                    By clicking, I accept the
                    <a href="/"> terms of the service</a> and{" "}
                    <a href="/">privacy policy</a>
                  </p>
                </label>
                <div className="w-100 mt-4 mb-3">
                  <button type="submit" className="w-100 btn-signin">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
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
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1
                }}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <OtpViewComponents
                handleChange={(evt) => setOtp(evt)}
                otp={otp}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => otpSubmitHandler()}>Submit</Button>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};

export default Signup;
