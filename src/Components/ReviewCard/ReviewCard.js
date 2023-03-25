import React from 'react';
import './ReviewCard.scss';
import { Rating } from "@mui/material";
import Avatar from 'react-avatar';
import { FaThumbsUp } from "react-icons/fa";
import Image from '../../Assets/Images/img1.png';

export default function ReviewCard() {
    return (
        <div className='col-lg-6 col-md-6 px-md-3 my-3 px-0'>
            <div className='review-card-container p-3'>
                <div className='header d-flex px-2 justify-content-between w-100'>
                    <div className='d-flex justify-content-start'>
                        <Avatar className='mr-2' size='52' round name="Web Ashlar" />
                        <div>
                            <p className='user-name m-0'>Jack Sans</p>
                            <p className='text-muted m-0'>1 day ago</p>
                        </div>
                    </div>
                    <div>
                        <div className='d-flex justify-content-end'>
                            <p className="m-0 mr-2">{Math.round(3 || 0).toFixed(1)}</p>
                            <Rating
                                name="simple-controlled"
                                value={Math.round(3).toFixed(1)}
                                disabled={true}
                            />
                            <p className="m-0 ml-2 text-muted">({9 || 0})</p>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <p className='m-0 text-muted'>Helpful? <FaThumbsUp className='ml-1 thumsup-icon' /></p>
                        </div>
                    </div>
                </div>
                <div className='body px-2 py-3'>
                    <p className='m-0 review-text'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                        been the industry's standard dummy text ever since the 1500s, when an unknown printer took  and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknownz
                    </p>
                </div>
                <div className='review-img-container pt-2 px-2 w-100'>
                    <img className='review-img' src={Image} alt='review-img' />
                    <img className='review-img mx-2' src={Image} alt='review-img' />
                    <img className='review-img mx-2' src={Image} alt='review-img' />
                    <img className='review-img' src={Image} alt='review-img' />
                </div>
            </div>
        </div>
    )
}
