import React from "react";
import { Grid, TextField } from "@mui/material";
import "./SearchGstNumber.scss";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  gstVerify,
  postGstRecord
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CommonGstList from "../../Components/CommonGstList/CommonGstList";

const SearchGstNumber = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, isLoading] = React.useState(false);
  const [verificationValue, setVerificationValue] = React.useState("");
  const [gstSearchData, setGstSearchData] = React.useState([]);

  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);

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
        einvoiceStatus: getRow.einvoiceStatus
      }
    };
    dispatch(postGstRecord(reqeObj)).then((res) => {
      if (res?.payload?.status === true) {
        if (getUserInfo !== undefined && getUserInfo !== null) {
          navigate(`/gst-information/${getRow?.gstin}`, {
            state: { getRow }
          });
        } else {
          navigate("/login");
          localStorage.setItem("search-selectedGst", JSON.stringify(getRow));
        }
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
              placeholder="Search Gst Number Or Business Name"
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
        <CommonGstList
          cardListData={gstSearchData}
          onCardClick={(row) => onPostHandle(row)}
        />
      </Grid>
    </div>
  );
};

export default SearchGstNumber;
