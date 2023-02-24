import React, { useState } from "react";
import "./Dashboard.scss";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { BASE_URL } from "../../Constant/ApiUrl";
import axios from "axios";

const Dashboard = () => {
  const [getSearchData, setSearchData] = useState([]);
  const validationSchema = Yup.object().shape({
    gstNumber: Yup.string()
      .min(15, "GST must be at least 15 characters")
      .max(15, "GST must be at least 15 characters")
      .required("GST Number is required")
  });

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0
    }
  }));

  const onSearch = async (val) => {
    const res = await axios(
      `${BASE_URL}custom/search/name_and_pan/?keyword=${val?.gstNumber}`
    );
    const getResult = await res.data.data;
    console.log("res.data", res.data);
    if (Object.keys(res.data.data).length === 0) {
      setSearchData([]);
    } else {
      setSearchData(getResult);
    }
  };

  return (
    <div className="main-hom-view">
      <div className="container mt-5" role="main">
        <Formik
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
                              placeholder="Search GSN number here..."
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
