import React from 'react';
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import {Navigate, Route, Routes} from "react-router-dom";
import img from "../assets/img/full-screen-image-2.jpg";
import {ToastContainer} from "react-toastify";

const Auth = () => {
    return (
        <div className="full-page section-image" data-color="black"
             data-image="/light-bootstrap-dashboard-pro-react/static/media/full-screen-image-2.e2e1e456.jpg">
            <div className="content d-flex align-items-center p-0">
                <div className="container">
                    <div className="mx-auto col-lg-5 col-md-8">
                        <Routes>
                            <Route path={'/'} element={<LoginPage />}/>
                            <Route path={'/register'} element={<RegisterPage/>}/>
                            <Route path={'*'} element={<Navigate replace to={'/'}/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
            <div className="full-page-background" style={{backgroundImage: 'url(' + img + ')'}}/>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
};

export default Auth;