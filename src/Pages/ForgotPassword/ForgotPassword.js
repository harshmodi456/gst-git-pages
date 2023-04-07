import React, { useState } from 'react';
import './ForgotPassword.scss';
import passwordBackgroung from '../../Assets/Images/login.svg';
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import CustomTextField from "../../Components/CustomTextField/CustomTextField";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConPassword, setShowConPassword] = React.useState(false);

    const validationSchema = Yup.object().shape({
        mobileNo: Yup.string().matches(new RegExp('^[0-9]+$'), 'Invalid mobile number')
            .min(10, "Mobile number must be a 10 digits")
            .max(10, "Mobile number must be a 10 digits")
            .required("Mobile number Number is Required.")
    });

    const passwordValidationSchema = Yup.object().shape({
        otp: Yup.string()
            .min(6)
            .max(6)
            .trim()
            .required('OTP is required'),
        userPwd: Yup.string()
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, ' ')
            .min(8, 'Password is too short.')
            .trim()
            .required('Required'),
        userConfirmPwd: Yup.string()
            .oneOf([Yup.ref('userPwd'), null], 'Passwords must be same')
            .min(8, 'Password is too short.')
            .trim()
            .required('Required')
    });

    const sendOtpHandler = () => {

    }

    const updatePasswordHandler = () => {

    }

    const UserEmailForm = () => {
        return (
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <div className="sent-otp-form-container">
                    <h3 className="m-0 pb-4 font-weight-bold">Forgot password?</h3>
                    <p className='text-muted mb-4 mt-0'>Please, enter the mobile number associated with your account.</p>
                    <Formik
                        initialValues={{
                            mobileNo: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => sendOtpHandler(values)}
                    >
                        {(props) => (
                            <Form autoComplete="off">
                                <div className="form-group">
                                    <Field
                                        name="mobileNo"
                                        type="text"
                                        component={CustomTextField}
                                        id="mobileNo"
                                        label="Mobile Number"
                                        variant="outlined"
                                        className="form-control-textFiled"
                                    />
                                </div>
                                <div className="w-100 mt-4 mb-3">
                                    <button className="w-100 btn-signin">
                                        Send
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }

    const UpdatePasswordForm = () => {
        return (
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <div className="sent-otp-form-container">
                    <h3 className="m-0 pb-4 font-weight-bold">Reset password</h3>
                    <p className='text-muted mb-4 mt-0'>Please type the verification code sent to your mobile number.</p>
                    <Formik
                        initialValues={{
                            otp: "",
                            userPwd: "",
                            userConfirmPwd: "",
                        }}
                        validationSchema={passwordValidationSchema}
                        onSubmit={(values) => updatePasswordHandler(values)}
                    >
                        {(props) => (
                            <Form autoComplete="off">
                                <div className="form-group">
                                    <Field
                                        name="otp"
                                        type="number"
                                        component={CustomTextField}
                                        id="otp"
                                        label="OTP"
                                        variant="outlined"
                                        className="form-control-textFiled"
                                    />
                                </div>
                                <div className="form-group">
                                    <Field
                                        name="userPwd"
                                        type={showPassword ? "text" : "password"}
                                        component={CustomTextField}
                                        label="Password"
                                        variant="outlined"
                                        className='form-control-textFiled'
                                    />
                                    {
                                        showPassword ? (
                                            <FaEyeSlash
                                                size={25}
                                                className="password-icon"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        ) : (
                                            <FaEye
                                                size={25}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-icon"
                                            />
                                        )
                                    }
                                </div>
                                <div className="form-group">
                                    <Field
                                        name="userConfirmPwd"
                                        type={showConPassword ? "text" : "password"}
                                        component={CustomTextField}
                                        label="Confirm Password"
                                        variant="outlined"
                                        className='form-control-textFiled'
                                    />
                                    {
                                        showConPassword ? (
                                            <FaEyeSlash
                                                size={25}
                                                className="password-icon"
                                                onClick={() => setShowConPassword(!showConPassword)}
                                            />
                                        ) : (
                                            <FaEye
                                                size={25}
                                                onClick={() => setShowConPassword(!showConPassword)}
                                                className="password-icon"
                                            />
                                        )
                                    }
                                </div>
                                <div className="w-100 mt-4 mb-3">
                                    <button className="w-100 btn-signin">
                                        Update
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }

    return (
        <div className='forget-password-container'>
            <div className="row m-0 p-0 w-100">
                <div className="col-lg-6 login-img d-flex justify-content-center align-items-center pt-5">
                    <img className="pb-5" src={passwordBackgroung} alt="background" />
                </div>
                <div className="col-lg-6 d-flex align-items-center justify-content-center">
                    {/* <UserEmailForm /> */}
                    {/* <UpdatePasswordForm /> */}
                    <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <div className="sent-otp-form-container">
                    <h3 className="m-0 pb-4 font-weight-bold">Reset password</h3>
                    <p className='text-muted mb-4 mt-0'>Please type the verification code sent to your mobile number.</p>
                    <Formik
                        initialValues={{
                            otp: "",
                            userPwd: "",
                            userConfirmPwd: "",
                        }}
                        validationSchema={passwordValidationSchema}
                        onSubmit={(values) => updatePasswordHandler(values)}
                    >
                        {(props) => (
                            <Form autoComplete="off">
                                <div className="form-group">
                                    <Field
                                        name="otp"
                                        type="number"
                                        component={CustomTextField}
                                        id="otp"
                                        label="OTP"
                                        variant="outlined"
                                        className="form-control-textFiled"
                                    />
                                </div>
                                <div className="form-group">
                                    <Field
                                        name="userPwd"
                                        type={showPassword ? "text" : "password"}
                                        component={CustomTextField}
                                        label="Password"
                                        variant="outlined"
                                        className='form-control-textFiled'
                                    />
                                    {
                                        showPassword ? (
                                            <FaEyeSlash
                                                size={25}
                                                className="password-icon"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        ) : (
                                            <FaEye
                                                size={25}
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="password-icon"
                                            />
                                        )
                                    }
                                </div>
                                <div className="form-group">
                                    <Field
                                        name="userConfirmPwd"
                                        type={showConPassword ? "text" : "password"}
                                        component={CustomTextField}
                                        label="Confirm Password"
                                        variant="outlined"
                                        className='form-control-textFiled'
                                    />
                                    {
                                        showConPassword ? (
                                            <FaEyeSlash
                                                size={25}
                                                className="password-icon"
                                                onClick={() => setShowConPassword(!showConPassword)}
                                            />
                                        ) : (
                                            <FaEye
                                                size={25}
                                                onClick={() => setShowConPassword(!showConPassword)}
                                                className="password-icon"
                                            />
                                        )
                                    }
                                </div>
                                <div className="w-100 mt-4 mb-3">
                                    <button className="w-100 btn-signin">
                                        Update
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
                </div>
            </div>
        </div>
    )
}