import React, { useState } from "react";
import "./ChangePassword.scss";
import { useAppDispatch } from "../../Redux/Store/Store";
import { updatePassword } from "../../Redux/Reducers/SearchGstNumReducer";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Backdrop from "@mui/material/Backdrop";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
// import { json } from "react-router-dom";

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [user] = useState(
    JSON.parse(localStorage.getItem("userInfo"))?.userInfo?.data
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [showNewConPassword, setshowNewConPassword] = useState(false);

  const initialValues = {
    oldPassword: "",
    userPwd: "",
    userConfirmPwd: "",
  };

  const PasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .trim()
      .required("Old password is required"),
    userPwd: Yup.string()
      .matches(/^(?=.*[A-Z])/, "  Must contain one uppercase character")
      .matches(/^(?=.*[a-z])/, " Must contain one lowercase character")
      .matches(/^(?=.*[!@#$%^&*])/, "  Must contain one special case character")
      .matches(/^(?=.*[0-9])/, "  Must contain one number character")
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    userConfirmPwd: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .test("passwordMatch", "Passwords must be the same", function (value) {
        const { userPwd } = this.parent;
        return userPwd === value;
      })
      .trim()
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: PasswordSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      submitHandler(values, setSubmitting, resetForm);
    },
  });

  const submitHandler = (values, setSubmitting, resetForm) => {
    setIsLoading(true);
    const params = {
      userId: user?._id,
      oldPassword: values?.oldPassword,
      password: values?.userPwd,
      confirmPassword: values?.userConfirmPwd,
    };
    dispatch(updatePassword(params)).then((res) => {
      if (res?.payload?.status === true) {
        toast.success(res?.payload?.message);
        setIsLoading(false);
        resetForm();
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else {
        toast.error(res?.payload?.response?.data?.message);
        setIsLoading(false);
        setSubmitting(false);
      }
    });
  };

  return (
    <div className="p-5 mt-5">
      <h4 className="m-0 p-0">Change password</h4>
      <hr />
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <div className="row my-5 mt-4">
          <div className="col-lg-4 form-group">
            <TextField
              type={showOldPassword ? "text" : "password"}
              className="w-100"
              name="oldPassword"
              label="Old Password"
              value={formik.values.oldPassword}
              error={
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
              onChange={formik.handleChange}
            />
            {showOldPassword ? (
              <FaEyeSlash
                size={25}
                className="password-icon"
                onClick={() => setShowOldPassword(!showOldPassword)}
              />
            ) : (
              <FaEye
                size={25}
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="password-icon"
              />
            )}
          </div>
          <div className="col-lg-4 form-group">
            <TextField
              type={showNewPassword ? "text" : "password"}
              className="w-100"
              name="userPwd"
              label="New Password"
              value={formik.values.userPwd}
              error={formik.touched.userPwd && Boolean(formik.errors.userPwd)}
              helperText={formik.touched.userPwd && formik.errors.userPwd}
              onChange={formik.handleChange}
            />
            {showNewPassword ? (
              <FaEyeSlash
                size={25}
                className="password-icon"
                onClick={() => setshowNewPassword(!showNewPassword)}
              />
            ) : (
              <FaEye
                size={25}
                onClick={() => setshowNewPassword(!showNewPassword)}
                className="password-icon"
              />
            )}
          </div>
          <div className="col-lg-4 form-group">
            <TextField
              type={showNewConPassword ? "text" : "password"}
              className="w-100"
              name="userConfirmPwd"
              label="Confirm New Password"
              value={formik.values.userConfirmPwd}
              error={
                formik.touched.userConfirmPwd &&
                Boolean(formik.errors.userConfirmPwd)
              }
              helperText={
                formik.touched.userConfirmPwd && formik.errors.userConfirmPwd
              }
              onChange={formik.handleChange}
            />
            {showNewConPassword ? (
              <FaEyeSlash
                size={25}
                className="password-icon"
                onClick={() => setshowNewConPassword(!showNewConPassword)}
              />
            ) : (
              <FaEye
                size={25}
                onClick={() => setshowNewConPassword(!showNewConPassword)}
                className="password-icon"
              />
            )}
          </div>
          <div className="text-right w-100 px-3 pt-4">
            <button type="submit" className="btn-confirm">
              Confirm
            </button>
          </div>
        </div>
      </form>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
