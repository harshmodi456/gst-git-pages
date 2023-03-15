import React from 'react';
import './Review.scss';

export default function Review(props) {

    const { reviewList } = props

    return (
        <div className='review-card-container my-4'>
            {
                reviewList?.length > 0 ? (
                    <>
                        {
                            reviewList?.map((review, index) => {
                                console.log(review)
                                return (
                                    <div className='review-card' key={index}>
                                        <div>
                                            <p className='label'>Business Name :</p>
                                            <p className='value'>{review?.gstId?.gstData?.lgnm}</p>
                                        </div>
                                        <div className='mt-3'>
                                            <p className='label'>Review :</p>
                                            <p className='value'>{review?.reviewText}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
                ) : (
                    <div>
                        <h4 className='text-muted m-5'>No Reviews</h4>                        
                    </div>
                )
            }
        </div>
    )
}