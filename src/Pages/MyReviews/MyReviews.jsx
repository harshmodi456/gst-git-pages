import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import gstData from "../../Constant/GstData.json";
import "./MyReviews.scss";
import CommonGstList from "../../Components/CommonGstList/CommonGstList";
import {
  getReviewByUser
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import Review from "../../Components/ReviewList/Review";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const MyReviews = () => {

  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(0);
  const user = localStorage.getItem('userInfo');
  const userId = JSON.parse(user)?.userInfo?.data?._id;
  const [reviewData, setReviewData] = React.useState([]);

  React.useEffect(() => {
    dispatch(getReviewByUser(userId)).then((res) => {
      setReviewData(res?.payload?.reviews);
    });
  })

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="my-reviews-div">
      <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
        <div className="main-div container">
          <h5>My Reviews</h5>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Given Reviews" {...a11yProps(0)} />
                <Tab label="Received Reviews" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Review reviewList={reviewData}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CommonGstList
                cardListData={gstData}
                onCardClick={(row) => alert("called")}
                visibleReview={false}
              />
            </TabPanel>
          </Box>
        </div>
      </Grid>
    </div>
  );
};

export default MyReviews;
