import React from "react";
import "./Login.scss";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch } from "../../Redux/Store/Store";
import { signInUser } from "../../Redux/Reducers/SignInUpReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import loginBackgroung from '../../Assets/Images/login.svg';


const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
 
  const [loading, isLoading] = React.useState(false);

  const validationSchema = Yup.object().shape({
    mobileNo: Yup.string().matches(new RegExp('^[0-9]+$'), 'Invalid mobile number')
      .min(10, "Mobile number must be a 10 digits")
      .max(10, "Mobile number must be a 10 digits")
      .required("Mobile number is required."),
    password: Yup.string().required("Password required")
  });

  const signInHandler = (takeValue) => {
    isLoading(true);
    setShowPassword(false)
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
      } else {
        isLoading(false);
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
      <div className="login-container mt-5">
        <div className="row m-0 p-0 w-100">
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <img className="pb-5" src={loginBackgroung} alt="background" />
          </div>
          <div className="col-lg-6 d-flex align-items-center justify-content-center mb-5 pb-5">
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
                    <div className="form-group w-100 mb-1">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        component={CustomTextField}
                        label="Password"
                        variant="outlined"
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
                    </div>
                    <div className="m-0 p-0 text-right">
                      <Link to="/forgot-password" className="have-account">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="w-100 mt-4 mb-3">
                      <button className="w-100 btn-signin">
                        Sign In
                      </button>
                    </div>
                    <div className="signup-link-container">
                      <div className="mt-2 account-signup">
                        <span style={{ color: "#27489f" }}>
                          You don't have an account?
                        </span>{" "}
                        <Link to="/signup" className="have-account">
                          Sign up
                        </Link>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
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
    </>
  );
};

export default Login;
