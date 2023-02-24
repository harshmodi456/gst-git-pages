import React from 'react';
import './Main.css';
import useHeaderFooter from '../Header/Hooks/useHeader.jsx';
import { Routes, Route } from 'react-router-dom';
import { routeData } from '../../Routes/RoutesData';

export default function Main() {

    const isVisibleHeader = useHeaderFooter();

    return (
        <div className={`${isVisibleHeader ? 'main-container': ''}`}>
            <Routes>
                {
                    routeData?.map((route, index) => {
                        return (
                            // <Route key={index} element={<route.route />} >
                            <Route key={index} path={route.path} element={<route.element />} />
                            // </Route>
                        )
                    })
                }
            </Routes>
        </div>
    )
}
