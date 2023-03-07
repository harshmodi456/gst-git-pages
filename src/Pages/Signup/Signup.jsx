import React from "react";
import "./Signup.scss";
import { Link, useNavigate } from "react-router-dom";
// import TextField from '@mui/material/TextField';
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import loginImg from "../../Assets/Images/img2.png";
import { useAppDispatch } from "../../Redux/Store/Store";
import { signUpUser } from "../../Redux/Reducers/SignInUpReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, isLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    gstin: Yup.string()
      .min(15, "GST must be at least 15 characters")
      .max(15, "GST must be at least 15 characters")
      .required("Gst Number is Required."),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Your password is too short.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    )
  });

  const signupHandler = (takeValue) => {
    // dispatch(
    //   gstVerify({
    //     gstin: takeValue.gstin
    //   })
    // ).then((res) => {
    //   if (res?.payload?.status === "success") {
    //     // navigate("/login");
    //     alert(res.payload.message);
    //   }
    // });
    isLoading(true);
    dispatch(
      signUpUser({
        gstin: takeValue.gstin,
        password: takeValue.password,
        passwordConfirm: takeValue.confirmPassword
      })
    ).then((res) => {
      if (res?.payload?.status === true) {
        navigate("/");
      }
      isLoading(false);
    });
  };

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
                    gstin: "",
                    password: "",
                    confirmPassword: ""
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    signupHandler(values);
                  }}
                >
                  {/* className="w-50 mx-auto m-5 p-5 border rounded" */}
                  <Form>
                    <div className="form-group">
                      <Field
                        name="gstin"
                        type="text"
                        component={CustomTextField}
                        id="gstin"
                        label="Gst Number"
                        variant="outlined"
                        className="form-control-textFiled"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        component={CustomTextField}
                        id="password"
                        label="Password"
                        variant="outlined"
                        // className="form-control-textFiled"
                        setShowPassword={setShowPassword}
                        showPassword={showPassword}
                        handleClickShowPassword={handleClickShowPassword}
                      />
                    </div>

                    <div className="form-group">
                      <Field
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        component={CustomTextField}
                        id="confirmPassword"
                        label="Confirm Password"
                        variant="outlined"
                        className="form-control-textFiled"
                        // setShowPassword={setShowPassword}
                        // showPassword={showPassword}
                        // handleClickShowPassword={handleClickShowPassword}
                      />
                    </div>

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
                      <Link to="/" className="have-account">
                        Login
                      </Link>
                    </div>

                    {/* <div className="w-100">
                  <button
                    type="submit"
                    className="btn btn-success mx-auto d-block mt-5"
                  >
                    Login
                  </button>
                </div> */}
                  </Form>
                </Formik>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Signup;
