import React from "react";
// import { Formik, Field, Form } from "formik";
// import * as Yup from "yup";
import { Card, CardContent, CardHeader, Grid, TextField } from "@mui/material";
// import CustomTextField from "../../Components/CustomTextField/CustomTextField";
// import SearchImg from "../../Assets/Images/img2.png";
import "./SearchGstNumber.scss";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  gstVerify,
  postGstRecord,
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import PostAddIcon from "@mui/icons-material/PostAdd";

const SearchGstNumber = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, isLoading] = React.useState(false);
  // const [gstNumber, setGstNumber] = React.useState("");
  const [verificationValue, setVerificationValue] = React.useState("");
  // const [checkGstIn, setCheckGstIn] = React.useState(false);
  // const [businessName, setBusinessName] = React.useState("");
  const [gstSearchData, setGstSearchData] = React.useState([]);

  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);
  // const validationSchema = Yup.object({
  //   gstNumber: Yup.string()
  //     .min(15, "GST must be at least 15 characters")
  //     .max(15, "GST must be at least 15 characters")
  //     .required("Gst Number is Required.")
  // });

  const searchGstHandler = (takeValue) => {
    isLoading(true);
    // const reqeObj = {
    //   gstin: takeValue
    // };

    dispatch(gstVerify(takeValue)).then((res) => {
      if (res?.payload?.status === true) {
        setGstSearchData(res?.payload?.data);
      } else {
        setGstSearchData([]);
      }

      isLoading(false);
    });
  };

  console.log("gstSearchData", gstSearchData);
  const onPostHandle = (getRow) => {
    isLoading(true);
    const reqeObj = {
      gstin: getRow.gstin,
      gstData: {
        stjCd: getRow.stjCd,
        dty: getRow.dty,
        stj: getRow.stj,
        lgnm: getRow.lgnm,
        cxdt: getRow.cxdt,
        gstin: getRow.gstin,
        lstupdt: getRow.lstupdt,
        ctb: getRow.ctb,
        rgdt: getRow.rgdt,
        pradr: getRow.pradr,
        ctjCd: getRow.ctjCd,
        sts: getRow.sts,
        tradeNam: getRow.tradeNam,
        ctj: getRow.ctj,
        einvoiceStatus: getRow.einvoiceStatus,
      },
    };
    dispatch(postGstRecord(reqeObj)).then((res) => {
      if (res?.payload?.status === true) {
        if (getUserInfo !== undefined && getUserInfo !== null) {
          navigate(`/gst-information/${getRow?.gstin}`, {
            state: { getRow },
          });
        } else {
          navigate("/login");
        }
        // navigate(`/business-result`);
      }
      isLoading(false);
    });
  };

  return (
    <div className="form-searchGst">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        className="container-div"
        // spacing={{ xs: 0, md: 3 }}
        columns={{ xs: 0, sm: 8, md: 12 }}
      >
        <div className="main-div d-flex container">
          <div className="form-group w-100">
            <label>Gst Number / Business Name</label>
            <TextField
              name="verificationValue"
              type="text"
              id="verificationValue"
              placeholder="Search Gst NUmber Or Business Name"
              variant="outlined"
              className="form-control-textFiled"
              value={verificationValue}
              onChange={(event) => {
                setVerificationValue(event.target.value);
              }}
            />
          </div>
          <div className="w-25 btn-div">
            <button
              type="button"
              onClick={() => {
                searchGstHandler(verificationValue);
              }}
              className="w-100 btn btn-lg btn-primary"
              disabled={verificationValue ? false : true}
            >
              Search
            </button>
          </div>
        </div>
        <div className={`table-view`}>
          {gstSearchData?.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "black",
              }}
            >
              Data not found!
            </div>
          ) : (
            gstSearchData?.map((row, index) => (
              <>
                <div
                  className="data-view"
                  onClick={() => onPostHandle(row)}
                  key={index}
                >
                  <div className="data-view-title media-view-title-first">
                    <div className="dataview-div-name">
                      Name : {row?.tradeNam}
                    </div>
                    {/* {!row.isAvailble && (
                      <div
                        className="dataview-div-icon"
                        onClick={() => onPostHandle(row)}
                      >
                        <PostAddIcon />
                      </div>
                    )} */}
                  </div>{" "}
                  <div className="data-view-title media-view-title">
                    Gst Number : {row?.gstin}
                  </div>
                  <div className="data-view-title">
                    Address : {row?.pradr?.addr?.bnm}
                  </div>
                </div>
              </>
            ))
          )}
        </div>
      </Grid>
      {/* <Grid
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
              <form>
                <div className="form-group">
                  <TextField
                    name="gstNumber"
                    type="text"
                    // component={CustomTextField}
                    id="gstNumber"
                    label="Gst Number"
                    variant="outlined"
                    className="form-control-textFiled"
                    value={gstNumber}
                    onChange={(event) => {
                      setCheckGstIn(true);
                      setGstNumber(event.target.value.toUpperCase());
                      setBusinessName("");
                      if (event.target.value?.toString().length <= 15) {
                        setCheckGstIn(true);
                      }
                      if (event.target.value?.toString().length === 15) {
                        setCheckGstIn(false);
                      }
                      if (event.target.value === "") {
                        setCheckGstIn(false);
                      }
                    }}
                    inputProps={{ maxLength: 15, minLength: 15 }}
                  />
                  {checkGstIn && (
                    <span className="text-danger">
                      GST must be at least 15 characters
                    </span>
                  )}
                </div>
                <h5 className="text-or mb-3">OR</h5>
                <div className="form-group">
                  <TextField
                    name="businessName"
                    type="text"
                    // component={CustomTextField}
                    id="businessName"
                    label="Business Name"
                    variant="outlined"
                    className="form-control-textFiled"
                    value={businessName}
                    onChange={(event) => {
                      setBusinessName(event.target.value);
                      setGstNumber("");
                    }}
                  />
                </div>
                <div className="w-50 mt-4 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      searchGstHandler(
                        gstNumber
                          ? {
                              gstin: gstNumber
                            }
                          : {
                              businessName: businessName
                            }
                      );
                    }}
                    className="w-100 btn btn-lg btn-primary"
                    disabled={
                      gstNumber ? checkGstIn : businessName ? false : true
                    }
                  >
                    Search
                  </button>
                </div>
              </form>
              <div
                className={`${
                  gstSearchData?.length === 0 ? "d-none" : "table-view"
                }`}
              >
                {gstSearchData?.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "black"
                    }}
                  >
                    Data not found!
                  </div>
                ) : (
                  gstSearchData?.map((row, index) => (
                    <>
                      <div
                        className="data-view"
                        // onClick={() => handleSelectBusiness(row)}
                      >
                        <div className="data-view-title media-view-title-first">
                          <div className="dataview-div-name">
                            Name : {row?.lgnm}
                          </div>
                          {!row.isAvailble && (
                            <div
                              className="dataview-div-icon"
                              onClick={() => onPostHandle(row)}
                            >
                              <PostAddIcon />
                            </div>
                          )}
                        </div>{" "}
                        <div className="data-view-title media-view-title">
                          Gst Number : {row?.gstin}
                        </div>
                        <div className="data-view-title">
                          Address : {row?.pradr?.addr?.bnm}
                        </div>
                      </div>
                    </>
                  ))
                )}
              </div>
              {/* <Formik
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
                  </Form>
                )}
              </Formik> */}
      {/* </CardContent>
          </Card>
        </Grid>
      </Grid> */}{" "}
    </div>
  );
};

export default SearchGstNumber;
