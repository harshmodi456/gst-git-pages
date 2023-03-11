import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.scss";
import { Grid } from "@mui/material";
const NotFound = () => (
  <div className="not-found-div">
    <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
      <div className="main-div container">
        <h1>404 - Not Found!</h1>
        <Link to="/">Go Home</Link>
      </div>
    </Grid>
  </div>
);

export default NotFound;
