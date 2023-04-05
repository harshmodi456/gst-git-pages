import React, { useEffect, useState } from 'react';
import './ReviewCard.scss';
import { Rating, Button } from "@mui/material";
import Avatar from 'react-avatar';
import { FaThumbsUp } from "react-icons/fa";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
    updateReview,
    addHelpfulCount
} from "../../Redux/Reducers/SearchGstNumReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TimeAgo from 'react-timeago';
import ReactTimeAgo from 'react-time-ago';
import AddIcon from '@mui/icons-material/Add';
import { Box } from "@mui/system";
import DeleteIcon from '@mui/icons-material/Delete';
import { Swiper, SwiperSlide } from "swiper/react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import moment from 'moment/moment';
import "./styles.css";

// import required modules
import { Keyboard, Pagination, Navigation } from "swiper";


export default function ReviewCard(props) {

    const { review } = props;
    let [helpfulCount, setHelpfulCount] = useState(review?.helpful?.length || 0);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [reviewText, setReviewText] = useState(review?.reviewText);
    const [rating, setRating] = useState(review?.rating);
    const takeUserInfo = localStorage.getItem("userInfo");
    const getUserInfo = JSON.parse(takeUserInfo)?.userInfo?.data;
    const userId = getUserInfo?._id;
    const [imgFile, setImgFile] = useState([]);
    const [imageUrl, setImageUrl] = useState([]);
    const [profileImg, setProfileImg] = useState([]);
    const [deleteBar, setDeleteBar] = useState(false);

    const fileChangeHandler = (event) => {
        const file = event.target.files;
        if (file != null) {
            for (let i = 0; i < event.target.files?.length; i++) {
                setProfileImg((current) => [...current, URL.createObjectURL(file[i])]);
                setImgFile((current) => [...current, file[i]]);
            }
        }
    }

    useEffect(() => {
        return (() => {
            setImgFile([]);
        })
    }, [])

    const setImgOnUpdate = () => {
        let imgArray = [];
        let counter = 0;
        review?.reviewImg?.map((image) => {
            imgArray.push(image?.imgUrl)
            if (++counter == review?.reviewImg?.length) {
                setProfileImg(imgArray)
            }
        })
    }

    const removeImage = (url) => {
        const deleteImage = profileImg?.filter((data) => data !== url);
        setProfileImg(deleteImage);
    }

    const bottomMenu = (toggle, url) => {
        setDeleteBar(toggle);
        setImageUrl(url);
    }

    const upload = () => {
        document.getElementById("reviewImgUrl").click()
    }

    const updateHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);
        let formData = new FormData();
        formData.append('id', review?._id);
        formData.append('reviewText', reviewText);
        formData.append('rating', rating);
        let oldImg = [];
        let count = 0;
        profileImg?.filter((img) => {
            if (img.slice(0, 4) == 'http') {
                oldImg.push({ imgUrl: img });
            }
            if (++count == profileImg?.length) {
                formData.append('oldImg', JSON.stringify(oldImg));
            }
        })

        for (const key of Object.keys(imgFile)) {
            localStorage.setItem('multiImg', true);
            formData.append('image', imgFile[key]);
        }

        dispatch(updateReview(formData)).then((res) => {
            if (res?.payload?.status) {
                document.getElementById(`btn-cancel-${review?._id}`).click();
                props.updateData(review?.gstId?._id, true);
                setIsLoading(false);
                setImgFile([]);
            }
            localStorage.setItem('multiImg', false);
            setIsLoading(false);
            setImgFile([]);
        });
    }

    const resetData = () => {
        setImageUrl([]);
        setProfileImg([]);
        setImgFile([]);
        setReviewText('');
        setRating('');
    }

    const handleHelpful = () => {
        const params = {
            reviewId: review?._id,
            userId: userId
        }

        dispatch(addHelpfulCount(params)).then((res) => {
            if (res?.payload?.status) {
                setHelpfulCount(helpfulCount + 1);
                setIsLoading(false);
            }
            setIsLoading(false);
        });
    }

    const currentDate = new Date();
    const reviewDate = new Date(review?.createdAt);
    const diffTime = Math.abs(reviewDate - currentDate);
    const reviewTime = Math.round(diffTime / 60000);
    const reviewTimeAgo = reviewTime <= 1 ? 'now' : <TimeAgo date={review?.createdAt} />

    return (
        <div className='col-lg-6 col-md-12 px-md-3 my-3 px-3'>
            <div className='review-card-container h-100 p-3'>
                <div className='header d-flex px-2 justify-content-between w-100'>
                    <div className='d-flex justify-content-start align-items-center'>
                        <Avatar className='mr-2' size='52' round name={`${review?.userId?.fName} ${review?.userId?.lName}`} src={review?.userId?.profileImg} />
                        <div>
                            <p className='user-name m-0 break-line-1'>{`${review?.userId?.fName} ${review?.userId?.lName}`}</p>
                            <p className='company-name m-0'>{review?.gstId?.gstData?.lgnm}</p>
                            <p className='time-lable text-muted m-0'><ReactTimeAgo timeStyle="round-minute" date={review?.createdAt} locale="en-US"/></p>

                            {/* <p className='time-lable text-muted m-0'><TimeAgo locale="en-US" date={review?.createdAt} /></p> */}
                        </div>
                    </div>
                    <div>
                        <div className='d-flex justify-content-end'>
                            <p className="m-0 mr-2">{Math.round(review?.rating || 0).toFixed(1)}</p>
                            <Rating
                                name="simple-controlled"
                                value={Math.round(review?.rating).toFixed(1)}
                                disabled={true}
                            />
                        </div>
                        <div className='d-flex align-items-center justify-content-end'>
                            {
                                review?.userId?._id === userId ? (
                                    <IconButton onClick={setImgOnUpdate} className='mr-2' size="small" data-toggle="modal" data-target={`#update-review-modal-${review?._id}`}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <></>
                                )
                            }
                            <p className='m-0 text-muted'>Helpful? <FaThumbsUp onClick={handleHelpful} className='ml-1 thumsup-icon' /><span className='ml-2'>({helpfulCount})</span></p>
                        </div>
                    </div>
                </div>
                <div className='body px-2 py-3'>
                    <p className='m-0 review-text min-height-wrap' data-toggle="modal" data-target={review?.reviewText?.length > 257 && `#review-text-modal-${review?._id}`}>
                        {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                        been the industry's standard dummy text ever since the 1500s, when an unknown printer took  and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknownz */}
                        {review?.reviewText?.slice(0, 257)}{review?.reviewText?.length > 257 && "..."}
                    </p>
                </div>
                <div className='review-img-container pt-2 px-2 w-100'>
                    {
                        review?.reviewImg?.slice(0, 4)?.map((data, index) => {
                            return (
                                <div className='m-1' key={index} data-toggle="modal" data-target={`#review-img-modal-${review?._id}`}>
                                    <img className='review-img' src={data?.imgUrl} alt='review-img' />
                                </div>
                            )
                        })
                    }
                    {
                        review?.reviewImg?.length > 4 && (
                            <div className="more-box-view m-1 btn btn-primary" data-toggle="modal" data-target={`#review-img-modal-${review?._id}`}>
                                <AddIcon sx={{ color: '#928585' }} /> <span className='more-text'>{review?.reviewImg?.length - 4}</span>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* <!-- Images Modal --> */}
            <div className="modal fade bd-example-modal-lg" size="lg" id={`review-img-modal-${review?._id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered  modal-lg" role="document">
                    <div className="modal-content modal-lg">
                        <div className="modal-header p-10">
                            <h5 className="modal-title" id="exampleModalLongTitle">All Images</h5>
                        </div>
                        <div className="modal-body p-10">
                            <>
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
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
                                    {
                                        review?.reviewImg?.map((data, index) => {
                                            return (
                                                <SwiperSlide key={index} className='m-1 swiper-block'>
                                                    <img src={data?.imgUrl} style={{ height: 550, width: 650, marginBottom: 60 }} />
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                </Swiper>
                            </>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" data-keyboard={false} tabIndex="-1" id={`review-text-modal-${review?._id}`}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content p-5">
                        <p className='m-0 review-text'>
                            {review?.reviewText}
                        </p>
                    </div>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" tabIndex="-1" id={`update-review-modal-${review?._id}`}>
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
                            />
                        </div>
                        <textarea
                            className="review-textarea"
                            as='textarea'
                            autoComplete="off"
                            rows={6}
                            placeholder="Write Review..."
                            value={reviewText}
                            onChange={(event) => {
                                setReviewText(event.target.value);
                            }}
                        />
                        <div className="img-container d-flex flex-wrap">
                            <input
                                multiple
                                id="reviewImgUrl"
                                name='reviewImgUrl'
                                accept="image/*"
                                hidden
                                type="file"
                                onChange={(event) => fileChangeHandler(event)}
                            />
                            <Box className='d-flex flex-wrap'>
                                {
                                    profileImg?.map((image, index) => {
                                        console.log(image, 'image')
                                        return (
                                            <Box onMouseOut={() => bottomMenu(false, image)} onMouseOver={() => bottomMenu(true, image)} key={index} sx={{ alignItems: 'center', m: 1, position: 'relative' }} >
                                                <img src={image} height={'150px'} width={'150px'} />
                                                {
                                                    deleteBar && imageUrl === image && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute', bottom: 0, backgroundColor: '#5A5A5A', width: '100%', opacity: 0.7 }}>
                                                            <DeleteIcon onClick={() => removeImage(image)} sx={{ color: '#E1E1E1' }} />
                                                        </Box>
                                                    )
                                                }
                                            </Box>
                                        )
                                    })
                                }
                            </Box>

                        </div>
                        <div className="">
                            <Button onClick={upload} className="mt-3" variant="outlined" startIcon={<CameraAltIcon />}>
                                Add Image
                            </Button>
                        </div>
                        <div className="btn-container text-right w-100 mt-4">
                            <button id={`btn-cancel-${review?._id}`} onClick={resetData} className="btn-cancel mr-3" data-toggle="modal" data-target={`#update-review-modal-${review?._id}`}>Cancel</button>
                            <button className="btn-submit" onClick={updateHandler}>Post</button>
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
    )
}
