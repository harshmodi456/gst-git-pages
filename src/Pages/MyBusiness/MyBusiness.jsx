import * as React from "react";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import "./MyBusiness.scss";
import { useNavigate } from 'react-router-dom';
import CommonGstList from "../../Components/CommonGstList/CommonGstList";
import { getGstByUserId, gstVerify, postGstRecord } from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import { TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

const MyBusiness = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(0);
  const [businessData, setBusinessData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [totalPage, setTotalPage] = React.useState(0);
  const [loading, isLoading] = React.useState(false);
  const [verificationValue, setVerificationValue] = React.useState("");
  const [gstSearchData, setGstSearchData] = React.useState([]);
  const [myBusinessData, setMyBusinessData] = React.useState([]);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);

  const myBusinessHandler = async () => {
    dispatch(getGstByUserId(getUserInfo?.userInfo?.data?._id)).then((res) => {
      if (res?.payload?.status === true) {
        setMyBusinessData(res?.payload?.data);
      } else {
        setMyBusinessData([]);
      }
      isLoading(false);
    });
  }

  React.useEffect(() => {
    myBusinessHandler();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const searchGstHandler = (takeValue) => {
    isLoading(true);
    dispatch(gstVerify(takeValue)).then((res) => {
      if (res?.payload?.status === true) {
        setGstSearchData(res?.payload?.data);
      } else {
        setGstSearchData([]);
      }
      isLoading(false);
    });
  };

  const onPostHandle = (getRow) => {
    isLoading(true);
    const reqeObj = {
      gstin: getRow.gstin,
      userId: getUserInfo?.userInfo?.data?._id,
      isMyBusiness: true,
      gstData: getRow,
    };

    dispatch(postGstRecord(reqeObj)).then((res) => {
      if (res?.payload?.status === true) {
        if (getUserInfo !== undefined && getUserInfo !== null) {
          navigate(`/gst-information/${getRow?.gstin || getRow?._doc?.gstin}`, {
            state: { getRow }
          });
        } else {
          navigate("/login");
        }
      }
      isLoading(false);
    });
  };

  return (
    <div className="my-business-div">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
        <div className="main-div container">
          <h5 className="mb-4">My Business</h5>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Add Business" {...a11yProps(0)} />
                <Tab label="My Business" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div className="d-flex container justify-content-start align-items-center my-5">
                <div className="form-group w-100">
                  <p className="m-0">Gst Number / Business Name</p>
                  <TextField
                    name="verificationValue"
                    type="text"
                    id="verificationValue"
                    placeholder="Search Gst Number Or Business Name"
                    variant="outlined"
                    className="form-control-textFiled w-100 pr-4"
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
              <Box sx={{ width: "100%" }}>
                <CommonGstList
                  cardListData={gstSearchData}
                  onCardClick={(row) => onPostHandle(row)}
                />
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box sx={{ width: "100%" }}>
                <div className='my-5'>
                  <CommonGstList
                    cardListData={myBusinessData}
                  />
                </div>
              </Box>
            </TabPanel>
          </Box>
        </div>
      </Grid >
    </div >
  );
};

export default MyBusiness;
