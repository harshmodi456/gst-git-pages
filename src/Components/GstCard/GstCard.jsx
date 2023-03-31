import React, { useEffect, useState } from 'react';
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
    const { isMyBusiness } = props;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const takeUserInfo = localStorage.getItem("userInfo");
    const getUserInfo = JSON.parse(takeUserInfo);
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (gst) {
            let gstObj = gst;
            if (gst?._doc) {
                gstObj = gst?._doc?.gstData;
            }
            if (gst?.gstData) {
                gstObj = gst?.gstData;
            }
            if (gst?.adadr?.length > 0) {
                let addressStr = `${gstObj?.adadr[0]?.addr?.bno && gstObj?.adadr[0]?.addr?.bno}${gstObj?.adadr[0]?.addr?.bno && ', '}
                ${gstObj?.adadr[0]?.addr?.bnm && gstObj?.adadr[0]?.addr?.bnm}${gstObj?.adadr[0]?.addr?.bnm && ', '}
                ${gstObj?.adadr[0]?.addr?.loc && gstObj?.adadr[0]?.addr?.loc}${gstObj?.adadr[0]?.addr?.loc && ', '}
                ${gstObj?.adadr[0]?.addr?.st && gstObj?.adadr[0]?.addr?.st}${gstObj?.adadr[0]?.addr?.st && ', '}
                ${gstObj?.adadr[0]?.addr?.city && gstObj?.adadr[0]?.addr?.city}${gstObj?.adadr[0]?.addr?.city && ', '}
                ${gstObj?.adadr[0]?.addr?.dst && gstObj?.adadr[0]?.addr?.dst}${gstObj?.adadr[0]?.addr?.dst && ', '}
                ${gstObj?.adadr[0]?.addr?.stcd && gstObj?.adadr[0]?.addr?.stcd}${gstObj?.adadr[0]?.addr?.stcd && ', '}
                ${gstObj?.adadr[0]?.addr?.pncd && gstObj?.adadr[0]?.addr?.pncd}.`;

                setAddress(addressStr);
            } else {
                let addressStr = `${gstObj?.pradr?.addr?.flno && gstObj?.pradr?.addr?.flno}${gstObj?.pradr?.addr?.flno && ', '}
                ${gstObj?.pradr?.addr?.bno && gstObj?.pradr?.addr?.bno}${gstObj?.pradr?.addr?.bno && ', '}
                ${gstObj?.pradr?.addr?.bnm && gstObj?.pradr?.addr?.bnm}${gstObj?.pradr?.addr?.bnm && ', '}
                ${gstObj?.pradr?.addr?.st && gstObj?.pradr?.addr?.st}${gstObj?.pradr?.addr?.st && ', '}
                ${gstObj?.pradr?.addr?.city && gstObj?.pradr?.addr?.city}${gstObj?.pradr?.addr?.city && ', '}
                ${gstObj?.pradr?.addr?.dst && gstObj?.pradr?.addr?.dst}${gstObj?.pradr?.addr?.dst && ', '}
                ${gstObj?.pradr?.addr?.stcd && gstObj?.pradr?.addr?.stcd}${gstObj?.pradr?.addr?.stcd && ', '}
                ${gstObj?.pradr?.addr?.pncd && gstObj?.pradr?.addr?.pncd}.`;

                setAddress(addressStr);
            }
        }
    }, [gst]);

    const onPostHandle = () => {
        setIsLoading(true);
        let reqeObj;
        if (isMyBusiness) {
            reqeObj = {
                userId: getUserInfo?.userInfo?.data?._id,
                gstin: gst?.gstin || gst?._doc?.gstin,
                gstData: gst?.gstData || gst?._doc?.gstData || gst
            };
        } else {
            reqeObj = {
                gstin: gst?.gstin || gst?._doc?.gstin,
                gstData: gst?.gstData || gst?._doc?.gstData || gst
            };
        }
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
                        {address.slice(0, 9) == 'undefined' ? ' ' : address}
                        {/* {gst?._doc?.gstData?.adadr?.addr?.bnm || gst?._doc?.gstData?.pradr?.addr?.bnm || gst?.adadr?.addr?.bnm || gst?.pradr?.addr?.bnm || gst?.gstData?.pradr?.addr?.bnm} */}
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