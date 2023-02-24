import React from "react";
import "./Login.scss";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import { Link } from "react-router-dom";
// import { Button } from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validationSchema = Yup.object().shape({
    gstNumber: Yup.string()
      .min(15, "GST must be at least 15 characters")
      .max(15, "GST must be at least 15 characters")
      .required("GST Number is required"),
    password: Yup.string().required("Password required")
  });

  return (
    <div className="form-signin">
      <div className="form-card">
        <Card sx={{ width: 450 }}>
          <CardHeader title="Sign in" className="card-header text-center" />
          <CardContent className="mt-2">
            <Formik
              initialValues={{
                gstNumber: ""
              }}
              validationSchema={validationSchema}
              // onSubmit={(values) => handalAddTask(values)}
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
                  <div className="w-100">
                    <button className="w-100 btn btn-lg btn-primary">
                      Sign In
                    </button>
                  </div>
                  <div className="mt-2 forgot-pass">
                    <Link >Forgot password?</Link>
                  </div>
                  <div className="mt-3">
                    <span style={{ color: "#6a758b" }}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
