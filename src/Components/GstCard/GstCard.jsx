import React, { useState } from 'react';
import './GstCard.scss';
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store/Store";
import {
    postGstRecord
} from "../../Redux/Reducers/SearchGstNumReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function GstCard(props) {

    const { gst } = props;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const takeUserInfo = localStorage.getItem("userInfo");
    const getUserInfo = JSON.parse(takeUserInfo);
    const [isLoading, setIsLoading] = useState(false);

    const onPostHandle = () => {
        setIsLoading(true);
        const reqeObj = {
            gstin: gst.gstin || gst?._doc?.gstin,
            gstData: gst?.gstData || gst?._doc?.gstData || gst
        };

        if (gst?._doc) {
            navigate(`/gst-information/${gst?._doc?.gstin}`)
        } else {
            dispatch(postGstRecord(reqeObj)).then((res) => {
                if (res?.payload?.status === true) {
                    if (getUserInfo !== undefined && getUserInfo !== null) {
                        navigate(`/gst-information/${gst?.gstin || gst?._doc?.gstin}`, {
                            state: { gst }
                        });
                    } else {
                        navigate("/login");
                        localStorage.setItem("search-selectedGst", JSON.stringify(gst));
                    }
                }
                setIsLoading(false);
            });
        }
    };

    return (
        <div className='col-lg-4 col-md-6 px-md-3 my-3 px-0'>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div
                className='gst-card-container pt-3 pb-2 px-4'
                onClick={onPostHandle}
            >
                <div className='row my-1 font-weight-bold'>
                    <div className='col-lg-2 col-3'>
                        Name:
                    </div>
                    <div className='col-lg-10 col-9 company-name mr-0 pl-lg-4 break-line-1'>
                        {gst?.lgnm || gst?.gstData?.lgnm || gst?._doc?.gstData?.lgnm}
                    </div>
                </div>
                <div className='row my-2 font-weight-bold'>
                    <div className='col-lg-2 col-3'>
                        Address:
                    </div>
                    <div className='col-lg-10 col-9 company-addr mr-0 pl-lg-4 break-line-1'>
                        {gst?._doc?.gstData?.adadr?.addr?.bnm || gst?._doc?.gstData?.pradr?.addr?.bnm || gst?.adadr?.addr?.bnm || gst?.pradr?.addr?.bnm || gst?.gstData?.pradr?.addr?.bnm}
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