import React from "react";
import "./CommonGstList.scss";
import { Rating } from "@mui/material";

const CommonGstList = (props) => {
  const { cardListData, onCardClick } = props;

  return (
    <div className="main-common-div">
      <div className={`table-view`}>
        {cardListData?.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "black"
            }}
          >
            Data not found!
          </div>
        ) : (
          cardListData?.map((row, index) => (
            <>
              <div
                className="data-view"
                onClick={() => onCardClick(row)}
                key={index}
              >
                <div className="data-view-title media-view-title-first">
                  <div className="dataview-div-name">Name : {row?.lgnm || row?._doc?.gstData?.lgnm}</div>
                </div>{" "}
                <div className="data-view-title media-view-title">
                  Gst Number : {row?.gstin || row?._doc?.gstData?.gstin}
                </div>
                <div className="data-view-title">
                  Address : {row?.adadr?.length > 0 ? row?.adadr[0]?.addr?.bnm : row?.pradr?.addr?.bnm  || 
                  row?._doc?.gstData?.adadr?.length > 0 ? row?._doc?.gstData?.adadr[0]?.addr?.bnm : row?._doc?.gstData?.pradr?.addr?.bnm}
                </div>
                <div className="data-view-title review-main">
                  <span className="review-average">{Math.round(row?.avgRating) || 0}</span>
                  <span className="review-rating ml-2">
                    <Rating
                      name="simple-controlled"
                      value={Math.round(row?.avgRating)}
                    //   disabled={true}
                    />
                  </span>{" "}
                  <span className="review-text-span ml-2"> {row?.totalReview || 0 } reviews</span>
                </div>
              </div>
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default CommonGstList;
