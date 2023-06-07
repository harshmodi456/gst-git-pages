import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { TextField, Autocomplete, MenuItem, OutlinedInput, Menu, Button, Dialog, AppBar, Toolbar, Typography, Slide, DialogActions, DialogContent } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { renderToString } from 'react-dom/server';
import { OCR_DATA } from "./Main_OCR_GST";
import UploadIcon from '@mui/icons-material/Upload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Webcam from "react-webcam";
import axios from "axios";
import PartyModeIcon from '@mui/icons-material/PartyMode';

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
  const isSearchedData = localStorage.getItem("isSearched");
  const getUserInfo = JSON.parse(takeUserInfo);
  // const searchInput = React.useRef(null);
  const [focused, setFocused] = React.useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [selectedDst, setSelectedDst] = useState("");
  const [key, setKey] = useState(0);
  const [profileImg, setProfileImg] = useState([]);
  const [openCameraImg, setOpenCameraImg] = useState([])
  const [imageSvg, setImageSvg] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [textAnnotations, setTextAnnotations] = useState([]);
  const [apiResponseData, setapiResponseData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onFocus = () => setFocused(true);
  const onBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 500);
  };
  const [openCameraModal, setOpenCameraModal] = useState(false);
  const [show, setShow] = useState(false);
  // const handleShow = (e) => {
  //   setShow(true);
  // }

  const handleCloseMOdel = () => {
    setShow(false)
    setProfileImg('')
    setSelectedText('');
  }

  const handleopenCameraModal = () => {
    setOpenCameraModal(true)
    // startVideo()
  }

  const handleCloseOpenCameraMOdel = () => {
    setOpenCameraModal(false)
    setOpenCameraImg('')
    // setImageSvg('')
    handleClose()
  }

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
        localStorage.setItem("isSearched", true)
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

  const submitOCRImageHandler = () => {
    if (selectedText !== "") {
      setFocused(false);
      handleCloseMOdel()
      isLoading(true);
      addHistoryHandler(selectedText);
      const params = {
        userId: getUserInfo?.userInfo?.data?._id,
        verificationValue: selectedText,
      };
      setSearchValue(params?.verificationValue);
      dispatch(gstVerify(params)).then((res) => {
        if (res?.payload?.status === true) {
          setGstSearchData(res?.payload?.data);
          setIsSearched(true);
          isLoading(false);
        } else {
          setGstSearchData([]);
          setIsSearched(true);
          isLoading(false);
        }
        localStorage.setItem("isSearched", true)
        isLoading(false);
      });
    };
  }

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
    localStorage.setItem("isSearched", false)
    setSearchValue([]);
    if (getUserInfo?.userInfo?.data?._id) {
      fetchHistoryHandler();
      setSelectedStates([]);
      setSelectedDistrict([]);
      formik.values.verificationValue = "";
    }
  };

  const drawBoundingBoxes = useCallback((textApiResponse) => {
    const rectangles = textApiResponse.map((poly, index) => {

      let gstNoRegex = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);

      if (poly.description && gstNoRegex.test(poly.description) === true) {
        if (poly?.boundingPoly?.vertices?.length > 0) {
          const vertices = poly.boundingPoly.vertices;
          const x = vertices[0].x;
          const y = vertices[0].y;
          const width = vertices[1].x - vertices[0].x;
          const height = vertices[2].y - vertices[1].y;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              stroke="red"
              strokeWidth="2"
              fill="red"
              style={{ cursor: 'pointer' }}
              fillOpacity="0"
              data-name={poly.description}
              data-index={index}
              className='rectangle'
            />
          );
        }
      }
      return null;
    });

    const svg = (
      <svg width="100%" height="100%" className="svg-overlay">
        {rectangles}
      </svg>
    );
    const svgHTML = renderToString(svg);
    setImageSvg(svgHTML);
  }, [textAnnotations]);

  const handleClickOcr = useCallback((event) => {
    if (event?.target?.getAttribute("data-name")) {
      const clickedIndex = Number(event?.target?.getAttribute('data-index'));
      if (!isNaN(clickedIndex)) {
        setSelectedText(textAnnotations[clickedIndex]?.description);
        event.target.setAttribute('class', 'rectangle clicked');

        const svgElements = document.getElementsByClassName('rectangle');
        for (let i = 0; i < svgElements.length; i++) {
          const svgElement = svgElements[i];
          if (svgElement !== event?.target) {
            svgElement.classList.remove('clicked');
          }
        }
      }
    }
  }, [textAnnotations]);

  const handleFromDeviceUpload = async (event) => {
    const file = event.target.files[0];
    let url = await readFileAsync(file)
    const textAnnotations = await handleImageUpload(url)
    if (textAnnotations && textAnnotations.length > 0) {
      setProfileImg(URL.createObjectURL(file));
      let dataText = textAnnotations.slice(1)
      drawBoundingBoxes(dataText)
      setTextAnnotations(textAnnotations.slice(1));
    }
    handleClose()
  }

  const handleOpenCameraUpload = async (opencameraUrl) => {
    const url = opencameraUrl.split(',')[1];
    const textAnnotations = await handleImageUpload(url)
    if (textAnnotations && textAnnotations.length > 0) {
      setOpenCameraImg(opencameraUrl);
      setTextAnnotations(textAnnotations.slice(1));
      let dataText = textAnnotations.slice(1)
      drawBoundingBoxes(dataText)
    }
    handleClose()
  }

  const handleImageUpload = async (baseUrl) => {
    try {
      const apiUrl =
        'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCZIb_ldXWnTIkqQ4CeyLhLquTPxtEkqFQ';

      const response = await axios.post(apiUrl, {
        requests: [
          {
            image: {
              content: baseUrl,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      });
      return response.data.responses[0].textAnnotations;
    } catch (error) {
      console.error('Error:', error);
    }
    handleClose()
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    setapiResponseData(OCR_DATA);
    if (profileImg.length !== 0) {
      window.addEventListener('click', handleClickOcr);
      setShow(true);
      return () => {
        window.removeEventListener('click', handleClickOcr);
      };
    }
  }, [profileImg])

  useEffect(() => {
    setapiResponseData(OCR_DATA);
    if (openCameraImg.length !== 0) {
      window.addEventListener('click', handleClickOcr);
      // setShow(true);
      return () => {
        window.removeEventListener('click', handleClickOcr);
      };
    }
  }, [openCameraImg])

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const webcamRef = useRef(null);

  const videoConstraints = {
    // width: 1280,
    // height: 720,
    facingMode: "user"
  };

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setOpenCameraImg(imageSrc)
      handleOpenCameraUpload(imageSrc)
    },
    [webcamRef]
  );

  const recapture = () => {
    setOpenCameraImg('')
  }


  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {isSearched && isSearchedData === "true" ? (
          <div className="my-5">
            <div className="searchContainer px-md-5">
              <div className="d-flex align-items-center">
                <IconButton onClick={backButtonHandler} className="ml-1">
                  <ArrowBackIcon />
                </IconButton>
                <h5 className="m-0 text-muted ml-2 mr-4">Back</h5>
                <h4 className="m-0 title">{`Search Result based on GSTIN/UIN:- ${searchValue ? searchValue.toString().toUpperCase() : ""}`}</h4>
              </div>
              <div className="filterGstCard form-inline m-0 p-0 justify-content-end">
                <div className="col-5 p-0 col-md-2">
                  <Autocomplete
                    sx={{ m: 1 }}
                    multiple
                    options={stateData.sort()}
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
                    options={data.sort()}
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
            <Dialog
              fullScreen
              open={show}
              onClose={handleCloseMOdel}
            >
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseMOdel}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Uploaded Image
                  </Typography>
                  <Button autoFocus color="inherit" onClick={submitOCRImageHandler}>
                    Search
                  </Button>
                </Toolbar>
              </AppBar>
              <div className="font-weight-bold pl-2">Selected GST No : {selectedText}</div>
              <div className="container p-0">
                {profileImg && (
                  <img
                    id="uploaded-image"
                    src={profileImg}
                    alt="Uploaded"
                  // onLoad={drawBoundingBoxes}
                  />
                )}

                {imageSvg && (
                  <div dangerouslySetInnerHTML={{ __html: imageSvg }} />
                )}
              </div>
            </Dialog>
            <Dialog
              fullWidth={true}
              maxWidth={false}
              open={openCameraModal}
              onClose={handleCloseOpenCameraMOdel}
            >
              <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseOpenCameraMOdel}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Click Picture
                  </Typography>
                  {
                    openCameraImg.length < 1 ? <Button onClick={capture} color="inherit"><PhotoCameraIcon className="mr-2" />Capture photo</Button> : <Button onClick={recapture} color="inherit"><PartyModeIcon className="mr-2" />Recapture photo</Button>
                  }
                  <Button autoFocus color="inherit" onClick={submitOCRImageHandler}>
                    Search
                  </Button>
                </Toolbar>
              </AppBar>
              <DialogContent dividers={true}>
                <div className="font-weight-bold pl-2">Selected GST No : {selectedText}</div>
                <div className="container p-0">
                  {
                    openCameraImg.length < 1 && openCameraModal && (
                      <>
                        <Webcam
                          audio={false}
                          height={"100%"}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width={"100%"}
                          videoConstraints={videoConstraints}
                        />
                        <br />
                      </>
                    )
                  }
                  {openCameraImg.length > 0 && (
                    <>
                      <img
                        src={openCameraImg}
                        alt="Uploaded"
                      />
                      <div dangerouslySetInnerHTML={{ __html: imageSvg }} />
                    </>
                  )}
                </div>
              </DialogContent>
              <DialogActions>
              </DialogActions>
            </Dialog>
            <div className="row m-0 p-0 w-100">
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <div className="search-container">
                  <h3 className="m-0 pt-5 pb-2 font-weight-bold">
                    Search GST Taxpayer
                  </h3>
                  <OutlinedInput
                    autoComplete="off"
                    className="my-4 search-bar w-100"
                    id="verificationValue"
                    name="verificationValue"
                    placeholder="Enter GST No. / Name"
                    onChange={formik.handleChange}
                    value={formik.values.verificationValue}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    endAdornment={
                      <>
                        <Button
                          id="fade-button"
                          aria-controls={open ? 'fade-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          style={{ padding: "18px" }}
                          onClick={handleClick}>
                          <UploadIcon />
                        </Button>
                        <Menu
                          id="basic-menu"
                          aria-labelledby="demo-positioned-button"
                          anchorEl={anchorEl}
                          open={open}
                          style={{ width: "100%" }}
                          onClose={handleClose}
                        >
                          <Button component="label" className="btnhover" style={{ textDecoration: "none", padding: "16px 22px 16px 16px", color: "black" }}><FolderOpenIcon className="folderIcon" style={{ marginRight: "10px" }} />From Device<input type="file" accept="image/*" onChange={handleFromDeviceUpload} hidden /></Button><br />
                          <Button component="label" className="p-3 btnhover" style={{ color: "black" }} onClick={handleopenCameraModal} ><PhotoCameraIcon className="folderIcon" style={{ marginRight: "10px" }} />Open Camera</Button>
                        </Menu>
                      </>
                    }
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
