import React from "react";
import "./Login.scss";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import loginImg from "../../Assets/Images/img2.png";
import { useAppDispatch } from "../../Redux/Store/Store";
import { signInUser } from "../../Redux/Reducers/SignInUpReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import loginBackgroung from '../../Assets/Images/login.svg';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [loading, isLoading] = React.useState(false);

  const validationSchema = Yup.object().shape({
    mobileNo: Yup.string()
      .min(10, "Mobile number must be a 10 digits")
      .max(10, "Mobile number must be a 10 digits")
      .required("Mobile number Number is Required."),
    password: Yup.string().required("Password required")
  });

  const signInHandler = (takeValue) => {
    isLoading(true);
    dispatch(
      signInUser({
        mobileNo: takeValue.mobileNo,
        password: takeValue.password
      })
    ).then((res) => {
      if (res?.payload?.status === true) {
        let getGstResult = JSON.parse(
          localStorage.getItem("search-selectedGst")
        );
        if (getGstResult?.gstin) {
          navigate(`/gst-information/${getGstResult?.gstin}`, {
            state: { getGstResult }
          });
          isLoading(false);
        } else {
          navigate('/')
          isLoading(false);
        }
      }
    });
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="login-container">
        <div className="row m-0 p-0 w-100">
          <div className="col-lg-6 login-img d-flex justify-content-center">
            <img className="pb-5" src={loginBackgroung} alt="background" />
          </div>
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="login-form-container">
              <h3 className="m-0 pt-5 pb-4 font-weight-bold">Login</h3>
              <Formik
                initialValues={{
                  mobileNo: "",
                  password: ""
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => signInHandler(values)}
              >
                {(props) => (
                  <Form autoComplete="off">
                    <div className="form-group">
                      <Field
                        name="mobileNo"
                        type="text"
                        component={CustomTextField}
                        id="mobileNo"
                        label="Mobile Number"
                        variant="outlined"
                        className="form-control-textFiled"
                      />
                    </div>
                    <div className="form-group w-100">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        component={CustomTextField}
                        label="Password"
                        variant="outlined"
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                        handleClickShowPassword={handleClickShowPassword}
                      />
                    </div>
                    <div className="w-100 mt-4 mb-3">
                      <button className="w-100 btn-signin">
                        Sign In
                      </button>
                    </div>
                    <div className="mt-2 account-signup">
                      <span style={{ color: "#27489f" }}>
                        You don't have an account?
                      </span>{" "}
                      &nbsp;{" "}
                      <Link to="/signup" className="have-account">
                        Sign up
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
