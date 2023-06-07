import React, { useEffect, useState } from "react";
import "./ReviewCard.scss";
import { Rating, Button } from "@mui/material";
import Avatar from "react-avatar";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  updateReview,
  addHelpfulCount,
  getWriteReview,
} from "../../Redux/Reducers/SearchGstNumReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ReactTimeAgo from "react-time-ago";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { Swiper, SwiperSlide } from "swiper/react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import "swiper/css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";
import Swal from "sweetalert2";
import RichTextEditor from "react-rte";
import { Icon } from "@material-ui/core";

// import required modules
import { Keyboard, Pagination, Navigation } from "swiper";
import { IMAGE_BASE_URL } from "../../Constant/ApiUrl";

export default function ReviewCard(props) {
  const { review } = props;
  let [helpfulCount, setHelpfulCount] = useState(review?.helpful?.length || 0);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewText, setReviewText] = useState(
    RichTextEditor.createValueFromString(review?.reviewText, "html")
  );
  const [rating, setRating] = useState(review?.rating);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo)?.userInfo?.data;
  const userId = getUserInfo?._id;
  const [imgFile, setImgFile] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [profileImg, setProfileImg] = useState([]);
  const [deleteBar, setDeleteBar] = useState(false);
  const [disableHelpful, setDisableHelpful] = useState(false);
  const [seeMoreToggle, setSeeMoreToggle] = useState(false);
  const [key, setKey] = useState(0);

  const validateLogin = () => {
    if (getUserInfo === undefined || getUserInfo === null) {
      Swal.fire({
        icon: "error",
        title: "Login Required!",
        text: "Please login first to access more.",
      });
    }
  };

  // for rating-color
  const getColor = (value) => {
    if (value >= 4) {
      return "green";
    } else if (value >= 2) {
      return "orange";
    } else {
      return "red";
    }
  };
  const IconComponent = (props) => {
    const { value, ...other } = props;
    const color = getColor(value);

    return <Icon style={{ color }} {...other} />;
  };

  const fileChangeHandler = (event) => {
    const file = event.target.files;
    if (file != null) {
      for (let i = 0; i < event.target.files?.length; i++) {
        const randome = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
          /[018]/g,
          (c) =>
            (
              c ^
              (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
        setProfileImg((current) => [
          ...current,
          { id: randome, img: URL.createObjectURL(file[i]), blobUrl: file[i] },
        ]);

        setImgFile((current) => [...current, file[i]]);
      }
      setKey(key + 1);
    }
  };

  const handleDisableHelpful = () => {
    if (review) {
      if (review?.userId?._id === userId) {
        setDisableHelpful(true);
      }
      review?.helpful?.map((user) => {
        if (userId === user) {
          setDisableHelpful(true);
        }
      });
    }
  };

  useEffect(() => {
    handleDisableHelpful();
  }, [review]);

  useEffect(() => {
    return () => {
      setImgFile([]);
    };
  }, []);

  const setImgOnUpdate = () => {
    let imgArray = [];
    let counter = 0;
    review?.reviewImg?.map((image) => {
      const randome = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        (c) =>
          (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          ).toString(16)
      );
      // if (image.imgUrl) {
      //   imgArray.push({ id: randome, img: image?.imgUrl });
      // }else{
      imgArray.push({ id: randome, img: image });
      // }
      if (++counter === review?.reviewImg?.length) {
        setProfileImg(imgArray);
      }
    });
  };

  const removeImage = (remove_data, takeIndx) => {
    if (remove_data.id) {
      new Swal({
        title: "Are you sure?",
        html: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.value) {
          const deleteImage = profileImg?.filter(
            (data) => data?.id !== remove_data.id
          );
          setProfileImg(deleteImage);
        }
      });
    } else if (!remove_data.id) {
      const deleteImage = profileImg?.filter((data) => data !== remove_data);
      setProfileImg(deleteImage);
    }
  };

  const bottomMenu = (toggle, url) => {
    setDeleteBar(toggle);
    setImageUrl(url);
  };

  const upload = () => {
    document.getElementById("reviewImgUrl" + review?._id).click();
  };

  // useEffect(()=>{
  //   dispatch(getWriteReview(request)).then(
  //     (res) => {
  //       setReviewData(res?.payload?.reviews);
  //       document.getElementById("btn-cancel").click();
  //       fetchReview(gst?._id || gst?._doc?._id, true);
  //       isLoading(false);
  //     }
  //   );
  // },[])

  const updateHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let formData = new FormData();
    formData.append("id", review?._id);
    formData.append("reviewText", reviewText.toString("html"));
    formData.append("rating", rating);
    setReviewText(reviewText);
    let oldImg = [];
    let count = 0;
    profileImg?.filter((data) => {
      // if (data) {
      if (data?.img) {
        if (data?.img.slice(0, 4) !== "blob") {
          oldImg.push(data?.img);
          // oldImg.push({ imgUrl: data?.img });
        }
        if (++count === profileImg?.length) {
          formData.append("oldImg", JSON.stringify(oldImg));
        }
      }
      // else if (data) {
      //   if (data?.img !== undefined) {
      //     if (data.slice(0, 4) === "http") {
      //     }
      //   } else {
      //     // oldImg.push({ imgUrl: data?.img });
      //     oldImg.push(data?.img);
      //     if (++count === profileImg?.length) {
      //       formData.append("oldImg", JSON.stringify(oldImg));
      //     }
      //   }
      // }
      // }
      // else if (data) {
      //   if (data.slice(0, 4) === "http") {
      //     oldImg.push({ imgUrl: data });
      //   }
      //   if (++count === profileImg?.length) {
      //     formData.append("oldImg", JSON.stringify(oldImg));
      //   }
      // }
    });
    for (const key of profileImg) {
      if (key?.img?.slice(0, 4) === "blob") {
        localStorage.setItem("multiImg", true);
        if (key.blobUrl) {
          formData.append("image", key?.blobUrl);
        }
      }
    }
    dispatch(updateReview(formData)).then((res) => {
      if (res?.payload?.status) {
        document.getElementById(`btn-cancel-${review?._id}`).click();
        props.updateData(review?.gstId?._id, true);
        setIsLoading(false);
        setImgFile([]);
      }
      localStorage.setItem("multiImg", false);
      setIsLoading(false);
      setImgFile([]);
    });
  };

  const resetData = () => {
    setImgFile([]);
    setImageUrl([]);
    setProfileImg([]);
    setReviewText(
      RichTextEditor.createValueFromString(
        review?.reviewText ? review?.reviewText : "",
        "html"
      )
    );
  };
  const handleHelpful = () => {
    validateLogin();
    const params = {
      reviewId: review?._id,
      userId: userId,
    };

    dispatch(addHelpfulCount(params)).then((res) => {
      if (res?.payload?.status) {
        setDisableHelpful(true);
        setHelpfulCount(helpfulCount + 1);
        setIsLoading(false);
      }
      setIsLoading(false);
    });
  };

  const CardHeader = () => {
    if (props.mySentReview === true) {
      return (
        <div className="header d-flex px-2 justify-content-between w-100">
          <div className="d-flex justify-content-start align-items-center">
            <Avatar
              className="mr-2"
              size="52"
              round
              name={(review?.gstId?.gstData?.tradeNam).slice(0, 1)}
            />
            <div>
              <p className="user-name m-0 break-line-1">
                {review?.gstId?.gstData?.tradeNam}
              </p>
              <p className="time-lable text-muted m-0">
                <ReactTimeAgo
                  timeStyle="round-minute"
                  date={Date.parse(review?.updatedAt)}
                  locale="en-US"
                />
              </p>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-end">
              <p className="m-0 mr-2 mt-1">
                {Math.round(review?.rating || 0).toFixed(1)}
              </p>
              <Rating
                name="simple-controlled"
                value={+Math.round(review?.rating).toFixed(1)}
                disabled={true}
                precision={0.5}
              />
            </div>
            <div className="d-flex align-items-center justify-content-end">
              {review?.userId?._id === userId ? (
                <IconButton
                  onClick={setImgOnUpdate}
                  className="mr-2"
                  size="small"
                  data-toggle="modal"
                  data-target={`#update-review-modal-${review?._id}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <></>
              )}
              <p className="m-0 text-muted">
                Helpful?
                <IconButton
                  disabled={disableHelpful}
                  onClick={handleHelpful}
                  className="ml-1"
                  size="small"
                >
                  <ThumbUpIcon
                    className={`${disableHelpful ? "" : "thumsup-icon"}`}
                    fontSize="inherit"
                  />
                </IconButton>
                <span className="ml-1">({helpfulCount})</span>
              </p>
            </div>
          </div>
        </div>
      );
    } else if (props.receiveReview == true) {
      return (
        <div className="header w-100">
          <div className="d-flex ml-2">
            <p className="text-success break-line-1">
              {review?.gstId?.gstData?.tradeNam}
            </p>
          </div>
          <div className="d-flex px-2 justify-content-between w-100">
            <div className="d-flex justify-content-start align-items-center">
              <Avatar
                className="mr-2"
                size="52"
                round
                name={`${review?.userId?.fName} ${review?.userId?.lName}`}
                src={review?.userId?.profileImg}
              />
              <div>
                <p className="user-name m-0 break-line-1">{`${review?.userId?.fName} ${review?.userId?.lName}`}</p>
                <p className="company-name m-0">
                  {review?.userId?.businessName}
                </p>
                <p className="time-lable text-muted m-0">
                  <ReactTimeAgo
                    timeStyle="round-minute"
                    date={Date.parse(review?.updatedAt)}
                    locale="en-US"
                  />
                </p>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-end">
                <p className="m-0 mr-2 mt-1">
                  {Math.round(review?.rating || 0).toFixed(1)}
                </p>
                <Rating
                  name="simple-controlled"
                  value={+Math.round(review?.rating).toFixed(1)}
                  disabled={true}
                  precision={0.5}
                />
              </div>
              <div className="d-flex align-items-center justify-content-end">
                {review?.userId?._id === userId ? (
                  <IconButton
                    onClick={setImgOnUpdate}
                    className="mr-2"
                    size="small"
                    data-toggle="modal"
                    data-target={`#update-review-modal-${review?._id}`}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <></>
                )}
                <p className="m-0 text-muted">
                  Helpful?
                  <IconButton
                    disabled={disableHelpful}
                    onClick={handleHelpful}
                    className="ml-1"
                    size="small"
                  >
                    <ThumbUpIcon
                      className={`${disableHelpful ? "" : "thumsup-icon"}`}
                      fontSize="inherit"
                    />
                  </IconButton>
                  <span className="ml-1">({helpfulCount})</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="header d-flex px-2 justify-content-between w-100">
          <div className="d-flex justify-content-start align-items-center">
            <Avatar
              className="mr-2"
              size="52"
              round
              name={`${review?.userId?.fName} ${review?.userId?.lName}`}
              src={review?.userId?.profileImg}
            />
            <div>
              <p className="user-name m-0 break-line-1">{`${
                review?.userId?.fName && review?.userId?.lName
                  ? review?.userId?.fName + " " + review?.userId?.lName
                  : "Anonymous"
              } `}</p>
              <p className="company-name m-0">{review?.userId?.businessName}</p>
              <p className="time-lable text-muted m-0">
                <ReactTimeAgo
                  timeStyle="round-minute"
                  date={Date.parse(review?.createdAt)}
                  locale="en-US"
                />
              </p>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-end">
              <p className="m-0 mr-2 mt-1">
                {Math.round(review?.rating || 0).toFixed(1)}
              </p>
              <Rating
                name="simple-controlled"
                value={+Math.round(review?.rating).toFixed(1)}
                disabled={true}
                precision={0.5}
              />
            </div>
            <div className="d-flex align-items-center justify-content-end">
              {review?.userId?._id === userId ? (
                <IconButton
                  onClick={setImgOnUpdate}
                  className="mr-2"
                  size="small"
                  data-toggle="modal"
                  data-target={`#update-review-modal-${review?._id}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <></>
              )}
              <p className="m-0 text-muted">
                Helpful?
                <IconButton
                  disabled={disableHelpful}
                  onClick={handleHelpful}
                  className="ml-1"
                  size="small"
                >
                  <ThumbUpIcon
                    className={`${disableHelpful ? "" : "thumsup-icon"}`}
                    fontSize="inherit"
                  />
                </IconButton>
                <span className="ml-1">({helpfulCount})</span>
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  const onChangeRichText = (value) => {
   
    let data = value.toString("html");
    setReviewText(value);
  };
  const toolbarConfig = {
    display: [],
  };

  const ReadMore = () => (
    <>
      {review?.reviewText?.length > 335 && (
        <p onClick={() => setSeeMoreToggle(!seeMoreToggle)}>
          {!seeMoreToggle ? "Read more" : "Read less"}
        </p>
      )}
    </>
  );
  return (
    <>
      {props.receiveReview === true && review?.userId?._id === userId ? null : (
        <div className="col-lg-6 col-md-12 px-md-3 my-3 px-3">
          <div className="review-card-container h-100 p-3">
            <div>{CardHeader()}</div>
            <div className="body px-2 py-3">
              {review?.reviewText?.length > 232 && (
                <p
                  onClick={() => setSeeMoreToggle(!seeMoreToggle)}
                  className="m-0 min-height-wrap"
                  dangerouslySetInnerHTML={{
                    __html:
                      review?.reviewText?.length > 232 && !seeMoreToggle
                        ? review?.reviewText.slice(0, 232) +
                          "<b> Read More...</b>"
                        : review?.reviewText,
                  }}
                ></p>
              )}

              {seeMoreToggle && review?.reviewText?.length > 232 && (
                <p
                  onClick={() => setSeeMoreToggle(!seeMoreToggle)}
                  className="m-0 min-height-wrap"
                  dangerouslySetInnerHTML={{
                    __html:
                      review?.reviewText?.length > 232 && !seeMoreToggle
                        ? review?.reviewText.slice(0, 232)
                        : review?.reviewText + "<b> Show Less</b>",
                  }}
                ></p>
              )}

              {review?.reviewText?.length < 232 && (
                <p
                  onClick={() => setSeeMoreToggle(!seeMoreToggle)}
                  className="m-0 min-height-wrap"
                  dangerouslySetInnerHTML={{
                    __html:
                      review?.reviewText?.length > 232 && !seeMoreToggle
                        ? review?.reviewText.slice(0, 232)
                        : review?.reviewText,
                  }}
                ></p>
              )}
              {/* {review?.reviewText?.length > 335 && (
                <p onClick={() => setSeeMoreToggle(!seeMoreToggle)}>
                  {!seeMoreToggle ? "Read more" : "Read less"}
                </p>
              )} */}
            </div>
            <div className="review-img-container pt-2 px-2 w-100">
              {review?.reviewImg?.map((image, index) => {
                return (
                  <div
                    className="m-1"
                    key={index}
                    data-toggle="modal"
                    data-target={`#review-img-modal-${review?._id}`}
                  >
                    <img
                      className="review-img"
                      src={`${IMAGE_BASE_URL + image}`}
                      alt="review-img"
                    />
                  </div>
                );
              })}
              {review?.reviewImg?.length > 4 && (
                <div
                  className="more-box-view m-1 btn btn-primary"
                  data-toggle="modal"
                  data-target={`#review-img-modal-${review?._id}`}
                >
                  <AddIcon sx={{ color: "#928585" }} />{" "}
                  <span className="more-text">
                    {review?.reviewImg?.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* <!-- Images Modal --> */}
          <div
            className="modal fade bd-example-modal-lg"
            size="lg"
            id={`review-img-modal-${review?._id}`}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered  modal-lg"
              role="document"
            >
              <div className="modal-content modal-lg">
                <div className="modal-header p-10">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    {review?.gstId?.gstData?.tradeNam}
                  </h5>
                </div>
                <div className="modal-body p-10">
                  <>
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={0}
                      keyboard={{
                        enabled: true,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      navigation={true}
                      modules={[Keyboard, Pagination, Navigation]}
                      className="mySwiper"
                    >
                      {review?.reviewImg?.map((data, index) => {
                        return (
                          <SwiperSlide key={index} className=" swiper-block">
                            <div className="outer-image-wrap">
                              <img src={data} alt="" />
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </>
                </div>
                <div className="modal-footer">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            data-keyboard={false}
            tabIndex="-1"
            id={`update-review-modal-${review?._id}`}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-5">
                <div className="write-review-title">
                  <h2>{review?.gstId?.gstData?.lgnm}</h2>
                  <p className="text-muted">Posting Publicity</p>
                </div>
                <div className="rate-view">
                    <Rating
                      className="mt-1 mb-4"
                      name="simple-controlled"
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                      size="large"
                      IconContainerComponent={IconComponent}
                    />
                  </div>
                <RichTextEditor
                  className="text-editor"
                  toolbarStyle={{
                    borderBottom: "0px",
                    padding: "2px",
                    marginBottom: "2px",
                  }}
                  id="review"
                  name="review"
                  toolbarConfig={toolbarConfig}
                  value={reviewText}
                  onChange={onChangeRichText}
                />
                <div className="img-container d-flex flex-wrap">
                  <input
                    key={key}
                    multiple
                    id={"reviewImgUrl" + review?._id}
                    name={"reviewImgUrl" + review?._id}
                    accept="image/*"
                    hidden
                    type="file"
                    onChange={(event) => fileChangeHandler(event)}
                  />
                  <Box className="d-flex">
                    {profileImg?.map((data, index) => {
                      return (
                        <Box
                          onMouseOut={() => bottomMenu(false, data)}
                          onMouseOver={() => bottomMenu(true, data)}
                          key={index}
                          sx={{
                            alignItems: "center",
                            m: 1,
                            position: "relative",
                          }}
                        >
                          {data?.img ? (
                            <img
                              src={data?.img}
                              height={"170px"}
                              width={"150px"}
                              alt=""
                            />
                          ) : (
                            <img
                              id="newImage"
                              src={data}
                              height={"150px"}
                              width={"150px"}
                              alt=""
                            />
                          )}
                          {imageUrl?.id
                            ? deleteBar &&
                              imageUrl?.id === data?.id && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    position: "absolute",
                                    bottom: 0,
                                    backgroundColor: "#5A5A5A",
                                    width: "100%",
                                    opacity: 0.7,
                                  }}
                                >
                                  <DeleteIcon
                                    onClick={() => removeImage(data, index)}
                                    sx={{ color: "#E1E1E1" }}
                                  />
                                </Box>
                              )
                            : deleteBar &&
                              imageUrl === data && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    position: "absolute",
                                    bottom: 0,
                                    backgroundColor: "#5A5A5A",
                                    width: "100%",
                                    opacity: 0.7,
                                  }}
                                >
                                  <DeleteIcon
                                    onClick={() => removeImage(data, index)}
                                    sx={{ color: "#E1E1E1" }}
                                  />
                                </Box>
                              )}
                        </Box>
                      );
                    })}
                  </Box>
                </div>
                <div className="">
                  <Button
                    onClick={upload}
                    className="mt-3"
                    variant="outlined"
                    startIcon={<CameraAltIcon />}
                  >
                    Add Image
                  </Button>
                </div>
                <div className="btn-container text-right w-100 mt-4">
                  <button
                    id={`btn-cancel-${review?._id}`}
                    onClick={() => resetData()}
                    className="btn-cancel mr-3"
                    data-toggle="modal"
                    data-target={`#update-review-modal-${review?._id}`}
                  >
                    Cancel
                  </button>
                  <button className="btn-submit" onClick={updateHandler}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      )}
    </>
  );
}
