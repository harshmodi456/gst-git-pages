import React, { useEffect, useState } from "react";
import "./GstCard.scss";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/Store/Store";
import { postGstRecord } from "../../Redux/Reducers/SearchGstNumReducer";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { toast } from "react-toastify";

export default function GstCard(props) {
  const { gst } = props;
  const { isMyBusiness } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");

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
        let addressStr = `${gstObj?.adadr[0]?.addr?.bno && gstObj?.adadr[0]?.addr?.bno
          }${gstObj?.adadr[0]?.addr?.bno && ", "}
                ${gstObj?.adadr[0]?.addr?.bnm && gstObj?.adadr[0]?.addr?.bnm}${gstObj?.adadr[0]?.addr?.bnm && ", "
          }
                ${gstObj?.adadr[0]?.addr?.loc && gstObj?.adadr[0]?.addr?.loc}${gstObj?.adadr[0]?.addr?.loc && ", "
          }
                ${gstObj?.adadr[0]?.addr?.st && gstObj?.adadr[0]?.addr?.st}${gstObj?.adadr[0]?.addr?.st && ", "
          }
                ${gstObj?.adadr[0]?.addr?.city && gstObj?.adadr[0]?.addr?.city
          }${gstObj?.adadr[0]?.addr?.city && ", "}
                ${gstObj?.adadr[0]?.addr?.dst && gstObj?.adadr[0]?.addr?.dst}${gstObj?.adadr[0]?.addr?.dst && ", "
          }
                ${gstObj?.adadr[0]?.addr?.stcd && gstObj?.adadr[0]?.addr?.stcd
          }${gstObj?.adadr[0]?.addr?.stcd && ", "}
                ${gstObj?.adadr[0]?.addr?.pncd && gstObj?.adadr[0]?.addr?.pncd
          }.`;

        setAddress(addressStr);
      } else {
        let addressStr = `${gstObj?.pradr?.addr?.flno && gstObj?.pradr?.addr?.flno
          }${gstObj?.pradr?.addr?.flno && ", "}
                ${gstObj?.pradr?.addr?.bno && gstObj?.pradr?.addr?.bno}${gstObj?.pradr?.addr?.bno && ", "
          }
                ${gstObj?.pradr?.addr?.bnm && gstObj?.pradr?.addr?.bnm}${gstObj?.pradr?.addr?.bnm && ", "
          }
                ${gstObj?.pradr?.addr?.st && gstObj?.pradr?.addr?.st}${gstObj?.pradr?.addr?.st && ", "
          }
                ${gstObj?.pradr?.addr?.city && gstObj?.pradr?.addr?.city}${gstObj?.pradr?.addr?.city && ", "
          }
                ${gstObj?.pradr?.addr?.dst && gstObj?.pradr?.addr?.dst}${gstObj?.pradr?.addr?.dst && ", "
          }
                ${gstObj?.pradr?.addr?.stcd && gstObj?.pradr?.addr?.stcd}${gstObj?.pradr?.addr?.stcd && ", "
          }
                ${gstObj?.pradr?.addr?.pncd && gstObj?.pradr?.addr?.pncd}.`;

        setAddress(addressStr);
      }
    }
  }, [gst]);

  const onPostHandle = () => {
    setIsLoading(true);
    if (isMyBusiness) {
      let reqeObj = {
        userId: getUserInfo?.userInfo?.data?._id,
        gstin: gst?.gstin || gst?._doc?.gstin,
        gstData: gst?.gstData || gst?._doc?.gstData || gst
      };
      dispatch(postGstRecord(reqeObj)).then((res) => {
        if (res?.payload?.status === true) {
          if (getUserInfo !== undefined && getUserInfo !== null) {
            navigate(`/gst-information/${gst?.gstin || gst?._doc?.gstin}`, {
              state: { gst }
            });
          } else {
            localStorage.setItem("search-selectedGst", JSON.stringify(gst));
            navigate("/login");
          }
        } else {
          setIsLoading(false);
          toast.error(res?.payload?.message);
        }
        setIsLoading(false);
      });
    } else {
      let reqeObj = {
        gstin: gst?.gstin || gst?._doc?.gstin,
        gstData: gst?.gstData || gst?._doc?.gstData || gst
      };

      if (gst?._doc) {
        // if (getUserInfo === undefined || getUserInfo === null) {
        //   setIsLoading(false);
        //   navigate("/login");
        // } else {
        navigate(`/gst-information/${gst?._doc?.gstin}`);
        // }
      } else {
        dispatch(postGstRecord(reqeObj)).then((res) => {
          if (res?.payload?.status === true) {
            if (getUserInfo !== undefined && getUserInfo !== null) {
            }
            navigate(`/gst-information/${gst?.gstin || gst?._doc?.gstin}`, {
              state: { gst }
            });
            // else {
            //   navigate("/login");
            //   localStorage.setItem("search-selectedGst", JSON.stringify(gst));
            // }
          } else {
            toast.danger(res?.payload?.message);
          }
          setIsLoading(false);
        });
      }
    }
  };

  return (
    <div className={`col-lg-4 col-md-6 px-md-3 my-3 px-0 ${props.myBusinessSearch ? 'col-lg-12' : ''}`}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        className="gst-card-container pt-3 pb-2 px-4 h-100"
        onClick={onPostHandle}
      >
        <div className="top-section-wrap">
          <div className="row my-1 font-weight-bold">
            <div className="col-lg-2 col-3">Name:</div>
            <div className="col-lg-9 col-8 company-name mr-0 pl-lg-4 break-line-1">
              {gst?.lgnm || gst?.gstData?.lgnm || gst?._doc?.gstData?.lgnm}
            </div>
            <div className="col-1">
              {gst?.isMyBusiness && (
                <div className="verified-mark">
                  <WorkspacePremiumIcon />
                </div>
              )}
            </div>
          </div>
          <div className="row my-2 font-weight-bold">
            <div className="col-lg-2 col-3">Address:</div>
            {/* <div className={`col-lg-10 col-9 company-addr mr-0 pl-lg-4 ${props.fullAddress ? 'company-full-addr' : 'break-line-1'}`}> */}
            <div className="col-lg-10 col-9 company-addr mr-0 pl-lg-4">
              {address.slice(0, 9) == 'undefined' ? ' ' : address}
              {/* {gst?._doc?.gstData?.adadr?.addr?.bnm || gst?._doc?.gstData?.pradr?.addr?.bnm || gst?.adadr?.addr?.bnm || gst?.pradr?.addr?.bnm || gst?.gstData?.pradr?.addr?.bnm} */}
            </div>
          </div>
        </div>
        <div className="bottom-section-wrap">
          <div className="d-flex justify-content-end">
            <p className="m-0 mr-2">
              {(Math.round(gst?.avgRating / 0.5 || 0) * 0.5).toFixed(1)}
            </p>
            <Rating
              className="mt-1"
              name="simple-controlled"
              value={(Math.round(gst?.avgRating / 0.5 || 0) * 0.5).toFixed(1)}
              readOnly={true}
              precision={0.5}
            />
            <p className="m-0 ml-2 text-muted">({gst?.totalReview || 0})</p>
          </div>
        </div>
      </div>
    </div>
  );
}
