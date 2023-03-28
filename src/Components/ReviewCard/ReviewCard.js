import React, { useEffect, useState } from 'react';
import './ReviewCard.scss';
import { Rating, Button } from "@mui/material";
import Avatar from 'react-avatar';
import { FaThumbsUp } from "react-icons/fa";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
    updateReview,
} from "../../Redux/Reducers/SearchGstNumReducer";
import Image from '../../Assets/Images/img1.png';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import TimeAgo from 'react-timeago';

export default function ReviewCard(props) {

    const { review } = props;
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [reviewText, setReviewText] = useState(review?.reviewText);
    const [rating, setRating] = useState(review?.rating);
    const takeUserInfo = localStorage.getItem("userInfo");
    const getUserInfo = JSON.parse(takeUserInfo)?.userInfo?.data;
    const userId = getUserInfo?._id;

    const updateHandler = () => {
        setIsLoading(true);
        const params = {
            _id: review?._id,
            reviewText: reviewText,
            rating: rating
        };
        dispatch(updateReview(params)).then((res) => {
            if (res?.payload?.status) {
                document.getElementById(`btn-cancel-${review?._id}`).click();
                props.updateData();
                setIsLoading(false);
            }
        });
    }

    return (
        <div className='col-lg-6 col-md-12 px-md-3 my-3 px-0'>
            <div className='review-card-container p-3'>
                <div className='header d-flex px-2 justify-content-between w-100'>
                    <div className='d-flex justify-content-start'>
                        <Avatar className='mr-2' size='52' round name={`${review?.userId?.fName} ${review?.userId?.lName}`} />
                        <div>
                            <p className='user-name m-0 break-line-1'>{`${review?.userId?.fName} ${review?.userId?.lName}`}</p>
                            <p className='text-muted m-0'><TimeAgo date={review?.createdAt} /></p>
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
                            <p className="m-0 ml-2 text-muted">({9 || 0})</p>
                        </div>
                        <div className='d-flex align-items-center justify-content-end'>
                            {
                                review?.userId?._id === userId ? (
                                    <IconButton className='mr-2' size="small" data-toggle="modal" data-target={`#update-review-modal-${review?._id}`}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                ) : (
                                    <></>
                                )
                            }
                            <p className='m-0 text-muted'>Helpful? <FaThumbsUp className='ml-1 thumsup-icon' /></p>
                        </div>
                    </div>
                </div>
                <div className='body px-2 py-3'>
                    <p className='m-0 review-text' data-toggle="modal" data-target="#review-text-modal">
                        {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                        been the industry's standard dummy text ever since the 1500s, when an unknown printer took  and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknownz */}
                        {review?.reviewText}
                    </p>
                </div>
                <div className='review-img-container pt-2 px-2 w-100'>
                    <img className='review-img' src={Image} alt='review-img' />
                    <img className='review-img mx-2' src={Image} alt='review-img' />
                    <img className='review-img mx-2' src={Image} alt='review-img' />
                    <img className='review-img' src={Image} alt='review-img' />
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" data-keyboard={true} tabindex="-1" id="review-text-modal">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content p-5">
                        <p className='m-0 review-text'>
                            {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took  and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknownz */}
                            {review?.reviewText}
                        </p>
                    </div>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" data-keyboard={true} tabindex="-1" id={`update-review-modal-${review?._id}`}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content p-5">
                        <div className="write-review-title">
                            <h2>Company name</h2>
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
                        <div className="btn-container text-right w-100 mt-4">
                            <button id={`btn-cancel-${review?._id}`} className="btn-cancel mr-3" data-toggle="modal" data-target={`#update-review-modal-${review?._id}`}>Cancel</button>
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