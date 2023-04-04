import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./UserProfile.scss";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from 'react-avatar';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  updateUser
} from "../../Redux/Reducers/SearchGstNumReducer";
import userImg from '../../Assets/Images/user.png';
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const UserProfile = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.data);
  const [profileImg, setProfileImg] = useState(userImg);
  const [imgFile, setImgFile] = useState(null);
  const userName = user?.fName + ' ' + user?.lName;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/')
    } else {
      if (user?.profileImg) {
        setProfileImg(user?.profileImg);
      }
    }
  }, [user])

  const fileChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file != null) {
      setProfileImg(URL.createObjectURL(file));
      setImgFile(file);
    }
  }

  const upload = () => {
    document.getElementById("profileImgUrl").click()
  }

  const removeImgHandler = () => {
    setProfileImg(userImg);
    setImgFile(null);
  }

  const initialValues = {
    fName: user?.fName,
    lName: user?.lName,
    mobileNo: user?.mobileNo,
  };

  const UserSchema = Yup.object().shape({
    fName: Yup.string()
      .trim()
      .required('Required'),
    lName: Yup.string()
      .trim()
      .required('Required'),
    mobileNo: Yup.string()
      .typeError("Invalid contact number")
      .trim()
      .matches(/^[1-9]{1}[0-9]{9}$/, 'Invalid phone number')
      .required(' '),
  })

  const submitHandler = async (userCredentials) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("fName", userCredentials?.fName);
    formData.append("lName", userCredentials?.lName);
    if (profileImg.slice(0,4) == 'http') {
      formData.append("oldImg", profileImg);
    } else {
      formData.append("oldImg", null);
    }
    if (imgFile) {
      localStorage.setItem('multiImg', true);
      formData.append("image", imgFile);
    }

    dispatch(updateUser(formData)).then((res) => {
      if (res?.payload?.status) {
        setUser(res?.payload?.data);

        const user = {
          userInfo: {
            data: res?.payload?.data,
            token: JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.token
          }
        }
        localStorage.setItem('userInfo', JSON.stringify(user));
        localStorage.setItem('multiImg', false);
        setIsLoading(false);
      }
      localStorage.setItem('multiImg', false);
      setIsLoading(false);
    });
  }

  const UpdateUserForm = () => {
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: UserSchema,
      onSubmit: (values) => {
        submitHandler(values);
      },
    });

    return (
      <div>
        <form className="px-5" onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="row my-5">
            <div className="col-6">
              <TextField
                className='w-100'
                name='fName'
                label="First Name"
                value={formik.values.fName}
                error={formik.touched.fName && Boolean(formik.errors.fName)}
                helperText={formik.touched.fName && formik.errors.fName}
                onChange={formik.handleChange}
              />
            </div>
            <div className="col-6">
              <TextField
                className='w-100'
                name='lName'
                label="Last Name"
                value={formik.values.lName}
                error={formik.touched.lName && Boolean(formik.errors.lName)}
                helperText={formik.touched.lName && formik.errors.lName}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="row my-5">
            <div className="col-6">
              <TextField
                className='w-100'
                name='mobileNo'
                label="Mobile Number"
                value={formik.values.mobileNo}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
          <div className="col-12 text-right my-5">
            <button type="submit" className="btn-update-profile">Update</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="my-user-profile-div">
      <Grid className="container-div" columns={{ xs: 0, sm: 8, md: 12 }}>
        <div className="main-div container-fluid px-5">
          <h1 className="px-5">Hello {user?.fName || ''},</h1>
          <hr />
          <div className="px-5 py-3">
            <div>
              <Avatar size={150} round src={profileImg} />
            </div>
            <input
              id="profileImgUrl"
              name='image'
              accept="image/*"
              hidden
              type="file"
              onChange={(event) => fileChangeHandler(event)}
            />
            <div className="mx-4 my-3 px-2">
              <IconButton color="primary" onClick={upload} aria-label="upload picture" component="label">
                <PhotoCamera />
              </IconButton>
              <IconButton color="primary" onClick={removeImgHandler} aria-label="upload picture" component="label">
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          </div>
          <UpdateUserForm />
        </div>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default UserProfile;
