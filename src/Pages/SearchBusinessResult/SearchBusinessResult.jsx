import React, { useEffect, useState } from "react";
import "./SearchBusinessResult.scss";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../../Constant/ApiUrl";
import axios from "axios";
import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import logoImg from "../../Assets/Images/img2.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  SearchByGstNumber,
  getAllGstRecord
} from "../../Redux/Reducers/SearchGstNumReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const SearchBusinessResult = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const location = useParams();
  const [getSearchData, setSearchData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, isLoading] = React.useState(false);

  const validationSchema = Yup.object().shape({
    gstNumber: Yup.string()
      .min(15, "GST must be at least 15 characters")
      .max(15, "GST must be at least 15 characters")
      .required("GST Number is required")
  });

  useEffect(() => {
    isLoading(true);
    dispatch(getAllGstRecord()).then((res) => {
      setSearchData(res.payload.gst);
      isLoading(false);
    });
  }, []);

  const onSearch = async () => {
    isLoading(true);
    if (searchInput !== "" || searchInput !== null) {
      dispatch(SearchByGstNumber(searchInput)).then((res) => {
        setSearchData(res.payload.gst);
        isLoading(false);
      });
    }
  };

  const handleSelectBusiness = (getRow) => {
    navigate(`/gst-information/${getRow?.gstData?.gstin}`, {
      state: { getRow }
    });
  };

  const rowObj = {
    tradeNam: "CANON INDIA PVT.LTD.",
    lgnm: "CANON INDIA PRIVATE LIMITED",
    gstin: "24AAACC4175D1Z4",
    addr: "Block H, TPS 14, SUMEL Business Park -6"
  };

  return (
    <div className="main-hom-view">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container" role="main">
        <Grid
          container
          spacing={{ xs: 0, md: 3 }}
          columns={{ xs: 0, sm: 8, md: 12 }}
        >
          <Grid item xs={4} className="grid-first">
            <img src={logoImg} alt="left logo" />
          </Grid>
          <Grid item xs={4} md={5}>
            <Card sx={{ width: 450 }}>
              <CardHeader
                title="Search Result Based On Business"
                className="card-header card-text-center"
              />
              <CardContent>
                <div className="row">
                  <div className="col-xs-12 col-md-8">
                    <div className="form-group form-input-fields">
                      <div className="input-group mb-4 border rounded-pill p-1">
                        <div className="border-0">
                          <button
                            id="button-addon4"
                            type="button"
                            className="btn btn-link text-info"
                          >
                            <i className="fa fa-search"></i>
                          </button>
                        </div>
                        <input
                          type="text"
                          name="gstNumber"
                          placeholder="Search GST number here..."
                          className="form-control bg-none border-0"
                          onChange={(e) => {
                            console.log(e.target.value);
                            if (
                              e.target.value == "" ||
                              e.target.value == null
                            ) {
                              dispatch(getAllGstRecord()).then((res) => {
                                setSearchData(res.payload.gst);
                              });
                            }
                            setSearchInput(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-4 col-md-2 ml-4 btn-div">
                    <button
                      type="button"
                      onClick={() => onSearch()}
                      className="btn btn-lg btn-primary"
                    >
                      <span className="search-button" aria-hidden="true"></span>{" "}
                      Search
                    </button>
                  </div>
                </div>
                {/* <Formik
                  initialValues={{
                    gstNumber: ""
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => onSearch(values)}
                >
                  {(props) => (
                    <Form>
                      <div className="row">
                        <div className="col-xs-12 col-md-8">
                          <div className="form-group form-input-fields">
                            <Field
                              name="gstNumber"
                              render={({
                                field,
                                form: { touched, errors }
                              }) => (
                                <>
                                  <div className="input-group mb-4 border rounded-pill p-1">
                                    <div className="border-0">
                                      <button
                                        id="button-addon4"
                                        type="button"
                                        className="btn btn-link text-info"
                                      >
                                        <i className="fa fa-search"></i>
                                      </button>
                                    </div>
                                    <input
                                      {...field}
                                      type="text"
                                      name="gstNumber"
                                      placeholder="Search GST number here..."
                                      className="form-control bg-none border-0"
                                    />
                                  </div>
                                  {touched[field.name] &&
                                    errors[field.name] && (
                                      <div className="error">
                                        {errors[field.name]}
                                      </div>
                                    )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-xs-4 col-md-2 ml-4 btn-div">
                          <button
                            type="submit"
                            className="btn btn-lg btn-primary"
                          >
                            <span
                              className="search-button"
                              aria-hidden="true"
                            ></span>{" "}
                            Search
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik> */}

                <div className="table-view">
                  {getSearchData.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "black"
                      }}
                    >
                      Data not found!
                    </div>
                  ) : (
                    // <>
                    //   <span className="main-title ml-2">
                    //     {rowObj?.tradeNam}
                    //   </span>
                    //   <div
                    //     className="data-view"
                    //     onClick={() => handleSelectBusiness(rowObj)}
                    //   >
                    //     <div className="data-view-title media-view-title-first p-3">
                    //       Name : {rowObj?.lgnm}
                    //     </div>{" "}
                    //     <div className="data-view-title media-view-title p-3">
                    //       Gst Number : {rowObj?.gstin}
                    //     </div>
                    //     <div className="data-view-title p-3">
                    //       Address : {rowObj?.addr}
                    //     </div>
                    //   </div>
                    // </>
                    getSearchData?.map((row, index) => (
                      <>
                        <span className="main-title ml-2" key={index}>
                          {row?.tradeNam}
                        </span>
                        <div
                          className="data-view"
                          onClick={() => handleSelectBusiness(row)}
                        >
                          <div className="data-view-title media-view-title-first">
                            Name : {row?.gstData?.lgnm}
                          </div>{" "}
                          <div className="data-view-title media-view-title">
                            Gst Number : {row?.gstData?.gstin}
                          </div>
                          <div className="data-view-title">
                            Address : {row?.gstData?.pradr?.addr?.bnm}
                          </div>
                        </div>
                      </>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
      {/* <Formik
          initialValues={{
            gstNumber: ""
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => onSearch(values)}
        >
          {(props) => (
            <Form>
              <div className="row ml-lg-5">
                <div className="col-xs-12 col-md-8">
                  <div className="form-group form-input-fields">
                    <Field
                      name="gstNumber"
                      render={({ field, form: { touched, errors } }) => (
                        <>
                          <div className="input-group mb-4 border rounded-pill p-1">
                            <div className="border-0">
                              <button
                                id="button-addon4"
                                type="button"
                                className="btn btn-link text-info"
                              >
                                <i className="fa fa-search"></i>
                              </button>
                            </div>
                            <input
                              {...field}
                              type="text"
                              name="gstNumber"
                              placeholder="Search GST number here..."
                              className="form-control bg-none border-0"
                            />
                          </div>
                          {touched[field.name] && errors[field.name] && (
                            <div className="error">{errors[field.name]}</div>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>
                <div className="col-xs-4 col-md-4">
                  <button type="submit" className="btn btn-lg btn-primary">
                    <span className="search-button" aria-hidden="true"></span>{" "}
                    Search
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <div className="table-view">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Param</StyledTableCell>
                  <StyledTableCell align="center">Type</StyledTableCell>
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">State</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getSearchData.length === 0 ? (
                  <div style={{ width: "300%", textAlign: "center" }}>
                    Data not found!
                  </div>
                ) : (
                  getSearchData?.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        width={"200px"}
                      >
                        {row?.tradeNam}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.dty}
                      </StyledTableCell>
                      <StyledTableCell align="center" width={"310px"}>
                        {row?.pradr?.ntr}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.stj}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div> */}
    </div>
  );
};

export default SearchBusinessResult;
