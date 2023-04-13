import React, { useState } from 'react';
import './ChangePassword.scss';
import { useAppDispatch } from "../../Redux/Store/Store";
import {
    updatePassword
} from "../../Redux/Reducers/SearchGstNumReducer";
import { TextField } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from 'react-toastify';

export default function ChangePassword() {

    const dispatch = useAppDispatch();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.data);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        oldPassword: '',
        userPwd: '',
        userConfirmPwd: '',
    };

    const PasswordSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .min(8, 'Password is too short.')
            .trim()
            .required('Required'),
        userPwd: Yup.string()
            .matches(/[a-zA-Z]/, "Password can only contain latin letters.")
            .min(8, 'Password is too short.')
            .trim()
            .required('Required'),
        userConfirmPwd: Yup.string()
            .oneOf([Yup.ref('userPwd'), null], 'Passwords must be same')
            .min(8, 'Password is too short.')
            .trim()
            .required('Required')
    })

    const submitHandler = (values) => {
        setIsLoading(true);
        const params = {
            userId: user?._id,
            oldPassword: values?.oldPassword,
            password: values?.userPwd,
            confirmPassword: values?.userConfirmPwd
        }
        dispatch(
            updatePassword(params)
        ).then((res) => {
            if (res?.payload?.status === true) {
                toast.success(res?.payload?.message)
                setIsLoading(false);
            } else {
                toast.error(res?.payload?.response?.data?.message)
                setIsLoading(false);
            }
        });
    }

    const UpdatePasswordForm = () => {
        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: PasswordSchema,
            onSubmit: (values) => {
                submitHandler(values);
            },
        });

        return (
            <div className='p-5 mt-5'>
                <h4 className='m-0 p-0'>Change password</h4>
                <hr />
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="row my-5 mt-4">
                        <div className="col-lg-4 form-group">
                            <TextField
                                type='password'
                                className='w-100'
                                name='oldPassword'
                                label="Old Password"
                                value={formik.values.oldPassword}
                                error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                onChange={formik.handleChange}
                            />

                        </div>
                        <div className="col-lg-4 form-group">
                            <TextField
                                type='password'
                                className='w-100'
                                name='userPwd'
                                label="New Password"
                                value={formik.values.userPwd}
                                error={formik.touched.userPwd && Boolean(formik.errors.userPwd)}
                                helperText={formik.touched.userPwd && formik.errors.userPwd}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="col-lg-4 form-group">
                            <TextField
                                type='password'
                                className='w-100'
                                name='userConfirmPwd'
                                label="Confirm New Password"
                                value={formik.values.userConfirmPwd}
                                error={formik.touched.userConfirmPwd && Boolean(formik.errors.userConfirmPwd)}
                                helperText={formik.touched.userConfirmPwd && formik.errors.userConfirmPwd}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="text-right w-100 px-3 pt-4">
                            <button type='submit' className='btn-confirm'>Confirm</button>
                        </div>
                    </div>
                </form>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div >
        )
    }

    return (<UpdatePasswordForm />)
}
