import React from 'react';
import './GstCard.scss';
import { Rating } from "@mui/material";

export default function GstCard(props) {

    const { gst } = props;

    return (
        <div className='col-4 px-3 my-3'>
            <div className='gst-card-container pt-3 pb-2 px-4'>
                <div className='row my-1 font-weight-bold'>
                    <div className='col-2'>
                        Name:
                    </div>
                    <div className='col-10 company-name mr-0 break-line-1'>
                        {gst?.lgnm || gst?.gstData?.lgnm || gst?._doc?.gstData?.lgnm}
                    </div>
                </div>
                <div className='row my-2 font-weight-bold'>
                    <div className='col-2'>
                        Address:
                    </div>
                    <div className='col-10 company-addr mr-0'>
                    { gst?._doc?.gstData?.adadr?.addr?.bnm || gst?._doc?.gstData?.pradr?.addr?.bnm || gst?.adadr?.addr?.bnm || gst?.pradr?.addr?.bnm || gst?.gstData?.adadr[0]?.addr?.bnm || gst?.gstData?.pradr?.addr?.bnm}
                    </div>
                </div>
                <div className='d-flex justify-content-end'>
                    <p className="m-0 mr-2">{Math.round(gst?.avgRating || 0).toFixed(1)}</p>
                    <Rating
                        name="simple-controlled"
                        value={Math.round(gst?.avgRating).toFixed(1)}
                        disabled={true}
                    />
                    <p className="m-0 ml-2 text-muted">({gst?.totalReview || 0})</p>
                </div>
            </div>
        </div>
    )
}