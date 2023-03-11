import React from "react";
import { Grid } from "@mui/material";
import "./UserProfile.scss";

const UserProfile = () => {
  return (
    <div className="my-user-profile-div">
      <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
        <div className="main-div container">
          <h1>UserProfile</h1>
        </div>
      </Grid>
    </div>
  );
};

export default UserProfile;
