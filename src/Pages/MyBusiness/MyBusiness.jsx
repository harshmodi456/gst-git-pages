import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import gstData from "../../Constant/GstData.json";
import "./MyBusiness.scss";
import CommonGstList from "../../Components/CommonGstList/CommonGstList";
import { getAllGstRecord } from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import InfiniteScroll from "react-infinite-scroll-component";
import { Rating } from "@mui/material";

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

const MyBusiness = () => {
  const [value, setValue] = React.useState(0);
  const dispatch = useAppDispatch();
  const [businessData, setBusinessData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [totalPage, setTotalPage] = React.useState(0);

  console.log(page, totalPage)

  React.useEffect(() => {
    getAllGstRecordFn({
      size: 10,
      page: 1
    });
  }, []);

  const getAllGstRecordFn = async (queryBody) => {
    await dispatch(getAllGstRecord(queryBody)).then((res) => {
      setTotalPage(res.payload.total_page);
      if (queryBody?.page === 1) {
        setBusinessData(res?.payload?.gst || []);
      } else {
        setBusinessData([...businessData, ...res.payload.gst]);
      }
    });
  };

  const fetchMoreData = async () => {
    if (page === totalPage) {
      setHasMore(false);
      return;
    }
    await setTimeout(async () => {
      setPage((prev) => prev + 1);
      await getAllGstRecordFn({
        size: 10,
        page: page + 1
      });
    }, 500);
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="my-business-div">
      <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
        <div className="main-div container">
          <h5>My Business</h5>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Own Business" {...a11yProps(0)} />
                <Tab label="Other Business" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <CommonGstList
                cardListData={gstData}
                onCardClick={(row) => alert("called")}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <InfiniteScroll
                dataLength={businessData?.length}
                scrollableTarget="scrollableDiv"
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h6 className="text-center">Loading...</h6>}
                className="gst-data-conatiner"
              >
                {businessData?.map((business, index) => (
                  < div>
                    {/* <span className="main-title ml-2" key={index}>
                      {business?.tradeNam}
                    </span>
                    <div
                      className="data-view"
                    >
                      <div className="data-view-title media-view-title-first">
                        Name : {business?.gstData?.lgnm}
                      </div>{" "}
                      <div className="data-view-title media-view-title">
                        Gst Number : {business?.gstData?.gstin}
                      </div>
                      <div className="data-view-title">
                        Address : {business?.gstData?.pradr?.addr?.bnm}
                      </div>
                    </div> */}
                    <div
                      className="data-view"
                      key={index}
                    >
                      <div className="data-view-title media-view-title-first">
                        <div className="dataview-div-name">Name : {business?.gstData?.lgnm || business?.gst?.gstData?.lgnm}</div>
                      </div>{" "}
                      <div className="data-view-title media-view-title">
                        Gst Number : {business?.gstin || business?.gst?.gstin}
                      </div>
                      <div className="data-view-title">
                        Address : {business?.gstData?.pradr?.addr?.bnm || business?.gst?.gstData?.pradr?.addr?.bnm}
                      </div>
                      <div className="data-view-title review-main mt-2">
                        <span className="review-average">{Math.round(business?.avgRating) || 0}</span>
                        <span className="review-rating ml-2">
                          <Rating
                            name="simple-controlled"
                            value={Math.round(business?.avgRating) || 0}
                          />
                        </span>{" "}
                        <span className="review-text-span ml-2"> {business?.totalReview || 0} reviews</span>
                      </div>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
              {/* <CommonGstList
                cardListData={gstData}
                onCardClick={(row) => alert("called")}
              /> */}
            </TabPanel>
          </Box>
        </div>
      </Grid>
    </div>
  );
};

export default MyBusiness;
