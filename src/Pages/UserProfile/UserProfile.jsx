import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import "./UserProfile.scss";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Avatar from 'react-avatar';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch } from "../../Redux/Store/Store";
import {
  updateUser
} from "../../Redux/Reducers/SearchGstNumReducer";

const UserProfile = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo'))?.userInfo?.data);
  const [profileImg, setProfileImg] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/')
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
    setProfileImg(null);
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
    // const formData = new FormData();
    // formData.append("fName", userCredentials?.fName);
    // formData.append("lName", userCredentials?.lName);
    // formData.append("image", imgFile);

    const params = {
      userId: user?._id,
      fName: userCredentials?.fName,
      lName: userCredentials?.lName
    }

    dispatch(updateUser(params)).then((res) => {
      if (res?.payload?.status) {
        setUser(res?.payload?.data)
      }
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
            <button type="submit">Update</button>
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
            <input
              id="profileImgUrl"
              name='profileImgUrl'
              accept="image/*"
              hidden
              type="file"
              onChange={(event) => fileChangeHandler(event)}
            />
            <div>
              <Avatar name={user?.fName + ' ' + user?.lName} size={150} round src={profileImg} />
            </div>
            {profileImg ?
              (
                <div className="mx-3">
                  <Button className="my-3" onClick={removeImgHandler} variant="outlined" startIcon={<CloseIcon />}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <Button className="my-3" onClick={upload} variant="outlined" startIcon={<AddIcon />}>
                    Update Image
                  </Button>
                </div>
              )
            }
          </div>
          <UpdateUserForm />
        </div>
      </Grid>
    </div>
  );
};

export default UserProfile;
