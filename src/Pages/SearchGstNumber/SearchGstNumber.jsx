import React, { useEffect, useState } from "react";
import "./SearchGstNumber.scss";
import "./searchGstNumber.css";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  gstVerify,
  postGstRecord,
  addHistory,
  fetchHistory,
  removeHistory,
} from "../../Redux/Reducers/SearchGstNumReducer";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import homeBackgroung from "../../Assets/Images/home-bg.svg";
import GstCard from "../../Components/GstCard/GstCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const SearchGstNumber = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);
  const [gstSearchData, setGstSearchData] = useState([]);
  const [history, setHistory] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [searchValue, setSearchValue] = useState([]);
  const [copysearchValue, setCopySearchValue] = useState([]);
  const [copyStatevalue, setCopyStatevalue] = useState([]);
  const [distTf, setDistTf] = useState(false);
  const [stateTf, setStateTf] = useState(false);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);
  const searchInput = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedDst, setSelectedDst] = useState("");
  const [key, setKey] = useState(0);

  const onFocus = () => setFocused(true);
  const onBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 500);
  };

  const fetchHistoryHandler = () => {
    dispatch(fetchHistory(getUserInfo?.userInfo?.data?._id)).then((res) => {
      if (res?.payload?.status === true) {
        setHistory(res?.payload?.data);
      }
    });
  };

  
  const addHistoryHandler = (searchValue) => {
    setSearchValue(searchValue);
    const params = {
      userId: getUserInfo?.userInfo?.data?._id,
      history: searchValue,
    };
    if (getUserInfo?.userInfo?.data?._id) {
      dispatch(addHistory(params)).then((res) => {
        if (res?.payload?.status === true) {
        }
      });
    }
  };

  useEffect(() => {
    if (getUserInfo?.userInfo?.data?._id) {
      fetchHistoryHandler();
    }
    setCopySearchValue(gstSearchData);
  }, []);

  const historyClickHandler = (item) => {
    onBlur();
    submitHandler({ verificationValue: item }, false, {});
  };

  useEffect(() => {
    setCopySearchValue(gstSearchData);
  }, [gstSearchData])

  const handleStateChange = (event, values) => {
    if (values.length === 0) {
      setStateTf(false)
      let tf = false
      if (distTf === true && stateTf === false) {
        setCopySearchValue(copyStatevalue)
      } if (distTf === false && tf === false) {
        setCopySearchValue(gstSearchData)
      }
      setSelectedStates(values);
    } else {
      setStateTf(true)
      setSelectedStates(values);
      const matchedData = gstSearchData.filter((data) =>
        values.includes(data.pradr?.addr?.stcd)
      );
      if (matchedData.length !== 0) {
        setCopySearchValue(matchedData)
        setCopyStatevalue(matchedData)
      }
      if (matchedData) {
        let dstValues = [
          ...new Set(matchedData.map((data) => data.pradr?.addr?.dst || "")),
        ];
        dstValues = dstValues.filter(x => x !== undefined);
        setSelectedDst(dstValues);
      }
    }
    setKey(key + 1);
  };

  const handleDistrictChange = (event, value) => {
    setSelectedDistrict(value);
    const matchedData = gstSearchData.filter((data) =>
      value.includes(data.pradr?.addr?.dst)
    );
    if (value.length === 0) {
      setDistTf(false)
      let tf = false
      if (tf === false && stateTf === false) {
        setCopySearchValue(gstSearchData)
      }
      if (tf === false && stateTf === true) {
        setCopySearchValue(copyStatevalue)
      }
      setSelectedDistrict(value);
    } else {
      setDistTf(true)
      setCopySearchValue(matchedData)
    }
    setKey(key + 1);
  };

  // for district dropdown
  let data;
  let stateData;
  stateData = [...new Set(gstSearchData.map((e) => e.pradr?.addr?.stcd))]
  stateData = stateData.filter(x => x !== undefined);
  if (selectedStates.length === 0) {
    data = [...new Set(gstSearchData.map((e) => e.pradr?.addr?.dst))];
    data = data.filter(x => x !== undefined);
  } else {
    data = selectedDst;
  }

  const submitHandler = (values, isFormSubmit, { resetForm }) => {
    if (values.verificationValue !== "") {
      setFocused(false);
      isLoading(true);
      if (isFormSubmit) {
        addHistoryHandler(values?.verificationValue);
      }
      const params = {
        userId: getUserInfo?.userInfo?.data?._id,
        verificationValue: values?.verificationValue || searchValue,
      };
      setSearchValue(params?.verificationValue);
      dispatch(gstVerify(params)).then((res) => {
        if (res?.payload?.status === true) {
          setGstSearchData(res?.payload?.data);
          setIsSearched(true);
          if (isFormSubmit) {
            resetForm();
          }
          isLoading(false);
        } else {
          setGstSearchData([]);
          setIsSearched(true);
          if (isFormSubmit) {
            resetForm();
          }
          isLoading(false);
        }
        isLoading(false);
      });
    };
  }
  const formik = useFormik({
    initialValues: {
      verificationValue: "",
    },
    validationSchema: Yup.object({
      verificationValue: Yup.string()
        .required("GST number or name is required")
        .trim(),
    }),
    onSubmit: (values, { resetForm }) => {
      submitHandler(values, true, { resetForm });
    },
  });


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
        einvoiceStatus: getRow.einvoiceStatus,
      },
    };

    if (getRow?._doc) {
      navigate(`/gst-information/${getRow?._doc?.gstin}`);
    } else {
      dispatch(postGstRecord(reqeObj)).then((res) => {
        if (res?.payload?.status === true) {
          if (getUserInfo !== undefined && getUserInfo !== null) {
            navigate(
              `/gst-information/${getRow?.gstin || getRow?._doc?.gstin}`,
              {
                state: { getRow },
              }
            );
          } else {
            navigate("/login");
            localStorage.setItem("search-selectedGst", JSON.stringify(getRow));
          }
        }
        isLoading(false);
      });
    }
    isLoading(false);
  };

  const backButtonHandler = () => {
    setIsSearched(false);
    setSearchValue([]);
    if (getUserInfo?.userInfo?.data?._id) {
      fetchHistoryHandler();
      setSelectedStates([]);
      setSelectedDistrict([]);
      formik.values.verificationValue = "";
    }
  };

  const removeHistoryHandler = (historyItem) => {
    const params = {
      userId: getUserInfo?.userInfo?.data?._id,
      history: historyItem,
    };

    dispatch(removeHistory(params)).then((res) => {
      if (res?.payload?.status === true) {
        let updatedHistory = history?.filter((item) => {
          if (historyItem !== item) {
            return item;
          }
        });

        setHistory(updatedHistory);
      }
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {isSearched ? (
          <div className="my-5">
            <div className="searchContainer px-md-5">
              <div className="d-flex align-items-center">
                <IconButton onClick={backButtonHandler} className="ml-1">
                  <ArrowBackIcon />
                </IconButton>
                <h5 className="m-0 text-muted ml-2 mr-4">Back</h5>
                <h4 className="m-0 title">{`Search Result based on GSTIN/UIN:- ${searchValue.toUpperCase()}`}</h4>
              </div>
              <div className="filterGstCard form-inline m-0 p-0 justify-content-end">
                <div className="col-5 p-0 col-md-2">
                  <Autocomplete
                    sx={{ m: 1 }}
                    multiple
                    options={stateData}
                    getOptionLabel={(option) =>
                      typeof option === "string" || option instanceof String
                        ? option
                        : ""
                    }
                    disableCloseOnSelect
                    value={selectedStates}
                    onChange={handleStateChange}
                    renderTags={(value, getTagProps) => {
                      if (value.length === 0) return null;

                      return (
                        <>
                          <Chip
                            variant="outlined"
                            label={value[0]}
                            {...getTagProps({ index: 0 })}
                            sx={{ width: "120px", overflow: "hidden" }}
                          />
                          {value.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-info btn-sm"
                              variant="outlined"
                              sx={{ width: 2, padding: 1, margin: 2 }}
                            >
                              +{value.length - 1}
                            </button>
                          )}
                        </>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        label="Select State"
                        placeholder={selectedStates !== "" ? "" : "Select State"}
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <MenuItem
                        {...props}
                        key={option}
                        value={option}
                        sx={{ justifyContent: "space-between" }}
                      >
                        {option}
                        {selected ? <CheckIcon color="info" /> : null}
                      </MenuItem>
                    )}
                  />
                </div>
                <div className="col-5 p-0 col-md-2">
                  <Autocomplete
                    sx={{ m: 1 }}
                    multiple
                    key={key}
                    options={data}
                    getOptionLabel={(option) =>
                      typeof option === "string" || option instanceof String
                        ? option
                        : ""
                    }
                    disableCloseOnSelect
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    renderTags={(value, getTagProps) => {
                      if (value.length === 0) return null;

                      return (
                        <>
                          <Chip
                            variant="outlined"
                            label={value[0]}
                            {...getTagProps({ index: 0 })}
                            sx={{ width: "120px", overflow: "hidden" }}
                          />
                          {value.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-info btn-sm"
                              variant="outlined"
                              sx={{ width: 2, padding: 1, margin: 2 }}
                            >
                              +{value.length - 1}
                            </button>
                          )}
                        </>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        label="Select District"
                        placeholder={
                          selectedDistrict !== "" ? "" : "Select District"
                        }
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <MenuItem
                        {...props}
                        key={option}
                        value={option}
                        sx={{ justifyContent: "space-between" }}
                      >
                        {option}
                        {selected ? <CheckIcon color="info" /> : null}
                      </MenuItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {gstSearchData?.length > 0 ? (
              <div className="row px-lg-4 m-0">
                {copysearchValue?.map((gst, index) => (
                  <GstCard key={index} gst={gst} fullAddress={true} />
                ))}
              </div>
            ) : (
              <div className="p-5 text-center w-100">
                <h4 className="text-muted pt-5">No data</h4>
              </div>
            )}
          </div>
        ) : (
          <div className="home-container">
            <div className="row m-0 p-0 w-100">
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <div className="search-container">
                  <h3 className="m-0 pt-5 pb-2 font-weight-bold">
                    Search GST Taxpayer
                  </h3>
                  <input
                    autoComplete="off"
                    className="my-4 search-bar w-100"
                    id="verificationValue"
                    name="verificationValue"
                    placeholder="Enter GST No. / Name"
                    onChange={formik.handleChange}
                    value={formik.values.verificationValue}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                  {formik.errors.verificationValue && (
                    <div>
                      <span style={{ color: "red" }}>
                        {formik.errors.verificationValue}
                      </span>
                    </div>
                  )}
                  {focused &&
                    (getUserInfo !== undefined || getUserInfo != null) ? (
                    <div className="history-container py-2">
                      {history?.length > 0 ? (
                        <>
                          {history?.map((item, index) => (
                            <div
                              className="px-4 history-item d-flex align-items-center justify-content-between"
                              key={index}
                            >
                              <div
                                className="d-flex align-items-center py-3 w-100"
                                onClick={() => historyClickHandler(item)}
                              >
                                <HistoryIcon className="mr-2" />
                                {item}
                              </div>
                              <div className="btn-remove-history">
                                <IconButton
                                  onClick={() => removeHistoryHandler(item)}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="w-100 text-center text-muted py-3">
                          No history
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div></div>
                  <div className="py-4">
                    <button type="submit" className="btn-search w-100 " onClick={() => {
                      submitHandler(formik.values, false, {
                        resetForm: formik.resetForm,
                      });
                    }}>
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-center">
                <img className="pb-5" src={homeBackgroung} alt="background" />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchGstNumber;
