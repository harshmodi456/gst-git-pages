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
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import GstCard from "../../Components/GstCard/GstCard";

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
    isLoading(true);
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
      document.getElementById("btn-cancel").click();
      setVerificationValue('');
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
    <>
      <div className="my-business-container py-5 px-lg-5 px-md-3">
        <h2 className="font-weight-bold pl-lg-5 pl-3">
          My Business
          <IconButton className="ml-3 add-business-btn" data-toggle="modal" data-target="#staticBackdrop">
            <AddIcon />
          </IconButton>
        </h2>

        <div className="px-lg-4 py-5 row px-4 m-0">
          {gstSearchData?.length > 0 ? (
            <>
              {
                gstSearchData?.map((gst, index) => (
                  <GstCard key={index} gst={gst} />
                ))
              }
            </>
          ) : (
            <>
              {
                myBusinessData?.length > 0 ? (
                  <>
                    {
                      myBusinessData?.map((gst, index) => (
                        <GstCard key={index} gst={gst} />
                      ))
                    }
                  </>
                ) : (
                  <div className="w-100 text-center">
                    <h4 className="text-muted">No data</h4>
                  </div>
                )
              }
            </>
          )}
        </div>


        {/* <!-- Modal --> */}
        <div className="modal fade" data-keyboard={true} tabindex="-1" id="staticBackdrop">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content p-5">
              <h5>Enter GST Number / Business Name</h5>
              <input
                placeholder="Enter Number"
                className="mt-3 search-gst-modal"
                value={verificationValue}
                onChange={(event) => {
                  setVerificationValue(event.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    searchGstHandler(verificationValue);
                  }
                }}
              />
              <div className="modal-btn-container mt-4">
                <button id="btn-cancel" className="btn-cancel mr-3" data-toggle="modal" data-target="#staticBackdrop">Cancel</button>
                <button
                  className="btn-add"
                  onClick={() => { searchGstHandler(verificationValue) }}
                  disabled={verificationValue ? false : true}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default MyBusiness;
