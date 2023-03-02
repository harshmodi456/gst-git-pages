import React, { useEffect } from "react";
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
import { gstVerify, signInUser } from "../../Redux/Reducers/SignInUpReducer";
// import { Button } from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const takeUserInfo = localStorage.getItem("userInfo");
    const getUserInfo = JSON.parse(takeUserInfo);
    if (getUserInfo !== undefined && getUserInfo !== null) {
      navigate("/");
    }
    if (getUserInfo) {
      navigate("/search-gst-number");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    gstNumber: Yup.string()
      .min(15, "GST must be at least 15 characters")
      .max(15, "GST must be at least 15 characters")
      .required("GST Number is required"),
    password: Yup.string().required("Password required")
  });

  const signInHandler = (takeValue) => {
    // dispatch(
    //   gstVerify({
    //     gstin: takeValue.gstNumber
    //   })
    // ).then((res) => {
    //   if (res?.payload?.status === "success") {
    //     // navigate("/login");
    //     alert(res.payload.message);
    //   }
    // });

    dispatch(
      signInUser({
        gstin: takeValue.gstNumber,
        password: takeValue.password
      })
    ).then((res) => {
      if (res?.payload?.status === true) {
        navigate("/search-gst-number");
      }
    });

    // navigate("/search-gst-number");
  };

  return (
    <div className="form-signin">
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
                    gstNumber: "",
                    password: ""
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => signInHandler(values)}
                >
                  {(props) => (
                    <Form>
                      <div className="form-group">
                        <Field
                          name="gstNumber"
                          type="text"
                          // placeholder="Add New Task"
                          component={CustomTextField}
                          id="gstNumber"
                          label="Gst Number"
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
