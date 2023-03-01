import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import SearchImg from "../../Assets/Images/img2.png";
import "./SearchGstNumber.scss";
import { useAppDispatch } from "../../Redux/Store/Store";
import { SearchByGstNumber } from "../../Redux/Reducers/SearchGstNumber";
import { useNavigate } from "react-router-dom";

const SearchGstNumber = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    gstNumber: Yup.string()
      .min(15, "GST must be at least 15 characters")
      .max(15, "GST must be at least 15 characters")
      .required("Gst Number is Required.")
  });

  const searchGstHandler = (takeValue) => {
    // dispatch(SearchByGstNumber(takeValue.gstNumber)).then((res) => {
    //   console.log("res.payload===", res.payload);
    //   // if (res?.payload?.status === "success") {
    //   //   navigate("/login");
    //   // }
    // });

    navigate("/business-result");
  };

  return (
    <div className="form-searchGst">
      <Grid
        container
        spacing={{ xs: 0, md: 3 }}
        columns={{ xs: 0, sm: 8, md: 12 }}
        // mt={0px}
      >
        <Grid item xs={4} className="grid-first">
          <img src={SearchImg} alt="left logo" />
        </Grid>
        <Grid item xs={4} md={5}>
          <Card sx={{ width: 450 }}>
            <CardHeader
              title="Search GST Number"
              className="card-header text-center"
            />
            <CardContent>
              <Formik
                initialValues={{
                  gstNumber: ""
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => searchGstHandler(values)}
              >
                {(props) => (
                  <Form>
                    <div className="form-group">
                      <Field
                        name="gstNumber"
                        type="text"
                        component={CustomTextField}
                        id="gstNumber"
                        label="Gst Number"
                        variant="outlined"
                        className="form-control-textFiled"
                      />
                    </div>
                    <h5 className="text-or mb-3">OR</h5>
                    <div className="form-group">
                      <Field
                        name="businessName"
                        type="text"
                        component={CustomTextField}
                        id="businessName"
                        label="Business Name"
                        variant="outlined"
                        className="form-control-textFiled"
                      />
                    </div>
                    <div className="w-50 mt-4 mb-3">
                      <button className="w-100 btn btn-lg btn-primary">
                        Submit
                      </button>
                    </div>
                    {/* <div className="mt-2 account-signup">
                        <span style={{ color: "#27489f" }}>
                          You don't have an account?
                        </span>{" "}
                        &nbsp;{" "}
                        <Link to="/signup" className="have-account">
                          Sign up
                        </Link>
                      </div> */}
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchGstNumber;
