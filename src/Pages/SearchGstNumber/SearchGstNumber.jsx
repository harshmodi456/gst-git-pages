import React, { useState } from "react";
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
import homeBackgroung from '../../Assets/Images/home-bg.svg';
import GstCard from "../../Components/GstCard/GstCard";

const SearchGstNumber = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);
  const [verificationValue, setVerificationValue] = useState("");
  const [gstSearchData, setGstSearchData] = useState([]);
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

    if (getRow?._doc) {
      navigate(`/gst-information/${getRow?._doc?.gstin}`)
    } else {
      dispatch(postGstRecord(reqeObj)).then((res) => {
        if (res?.payload?.status === true) {
          if (getUserInfo !== undefined && getUserInfo !== null) {
            navigate(`/gst-information/${getRow?.gstin || getRow?._doc?.gstin}`, {
              state: { getRow }
            });
          } else {
            navigate("/login");
            localStorage.setItem("search-selectedGst", JSON.stringify(getRow));
          }
        }
        isLoading(false);
      });
    }
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        gstSearchData?.length > 0 ? (
          <div className="mt-5">
            {
              gstSearchData?.length > 0 ? (
                <div className="row px-4 m-0">
                  {
                    gstSearchData?.map((gst, index) => (
                      <GstCard key={index} gst={gst} />
                    ))
                  }
                </div>
              ) : (
                <div className="p-5 text-center w-100">
                  <h4 className="text-muted pt-5">
                    No data
                  </h4>
                </div>
              )
            }
          </div>
        ) : (
          <div className="home-container">
            <div className="row m-0 p-0 w-100">
              <div className="col-6 d-flex align-items-center justify-content-center">
                <div className="search-container">
                  <h3 className="m-0 pt-5 pb-2 font-weight-bold">Search GST Taxpayer</h3>
                  <input
                    className="my-4 search-bar"
                    type="text"
                    placeholder="Enter GST No."
                    value={verificationValue}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        searchGstHandler(verificationValue);
                      }
                    }}
                    onChange={(event) => {
                      setVerificationValue(event.target.value);
                    }}
                  />
                  <div>
                    <label className="tandc-checkbox d-flex align-items-center justify-content-center">
                      <input type="checkbox" className="mr-3" />
                      <p className="m-0">
                        By clicking, I accept the<a href="/"> terms of the service</a> and<br /> <a href="/">privacy policy</a>
                      </p>
                    </label>
                  </div>
                  <div className="py-4">
                    <button
                      className="btn-search w-100"
                      onClick={() => {
                        searchGstHandler(verificationValue);
                      }}
                      disabled={verificationValue ? false : true}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <img className="pb-5" src={homeBackgroung} alt="background" />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default SearchGstNumber;
