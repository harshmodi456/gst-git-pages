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

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [loading, isLoading] = React.useState(false);

  // useEffect(() => {
  //   const takeUserInfo = localStorage.getItem("userInfo");
  //   const getUserInfo = JSON.parse(takeUserInfo);
  //   if (getUserInfo !== undefined && getUserInfo !== null) {
  //     navigate("/");
  //   }
  //   if (getUserInfo) {
  //     navigate("/search-gst-number");
  //   }
  // }, []);

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
        // navigate("/business-result");
        let getGstResult = JSON.parse(
          localStorage.getItem("search-selectedGst")
        );
        navigate(`/gst-information/${getGstResult?.gstin}`, {
          state: { getGstResult }
        });
      }
      isLoading(false);
    });
  };

  return (
    <div className="form-signin">
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
            <img src={loginImg} alt="login" />
          </Grid>
          <Grid item xs={4} md={5}>
            <Card sx={{ width: 450 }}>
              <CardHeader title="Sign in" className="card-header text-center" />
              <CardContent>
                <Formik
                  initialValues={{
                    mobileNo: "",
                    password: ""
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => signInHandler(values)}
                >
                  {(props) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          name="mobileNo"
                          type="text"
                          // placeholder="Add New Task"
                          component={CustomTextField}
                          id="mobileNo"
                          label="Mobile Number"
                          variant="outlined"
                          className="form-control-textFiled"
                        />
                      </div>
                      <div className="form-group">
                        <Field
                          name="password"
                          type={showPassword ? "text" : "password"}
                          // placeholder="Add New Task"
                          component={CustomTextField}
                          id="password"
                          label="Password"
                          variant="outlined"
                          className="form-control-textFiled"
                          setShowPassword={setShowPassword}
                          showPassword={showPassword}
                          handleClickShowPassword={handleClickShowPassword}
                        />
                      </div>
                      <div className="w-50 mt-4 mb-3">
                        <button className="w-100 btn btn-lg btn-primary">
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
                      {/* <div className="mt-2 forgot-pass">
                    <Link>Forgot password?</Link>
                  </div> */}
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Login;
