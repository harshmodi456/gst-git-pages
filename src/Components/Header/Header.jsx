import React from 'react';
import './Header.css';
import useHeaderFooter from './Hooks/useHeader.jsx';

export default function Header() {
    const isVisibleHeader = useHeaderFooter();

    return (
        <>
            {isVisibleHeader ? (
                <div className='header-container'>
                    <div className='d-flex h-100 align-items-center'>
                        <h3 className='m-0'>G S T</h3><h3 className='m-0 ml-2 text-danger'> I N </h3>
                    </div>
                </div>
            ) : (<></>)
            }
        </>
    )
}