import * as React from "react";
import Box from "@mui/material/Box";
import "./MyBusiness.scss";
import "./style.css"
import { useState } from "react";
import { Modal} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { getGstByUserId, gstVerify, postGstRecord } from "../../Redux/Reducers/SearchGstNumReducer";
import { useAppDispatch } from "../../Redux/Store/Store";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import GstCard from "../../Components/GstCard/GstCard";
import { useFormik } from "formik";
import * as Yup from "yup";

const MyBusiness = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = React.useState(false);
  const [gstSearchData, setGstSearchData] = React.useState([]);
  const [myBusinessData, setMyBusinessData] = React.useState([]);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);

  const myBusinessHandler = async () => {
    isLoading(true);
    dispatch(getGstByUserId(getUserInfo?.userInfo?.data?._id)).then((res) => {
      if (res?.payload?.status === true) {
        setMyBusinessData(res?.payload?.data);
      } else {
        setMyBusinessData([]);
      }
      isLoading(false);
    });
  }

  React.useEffect(() => {
    myBusinessHandler();
  }, []);

  const formik = useFormik({
    initialValues: {
      verificationValue: '',
    },
    validationSchema: Yup.object({
      verificationValue: Yup.string().required('GST number or name is required')
    }),
    onSubmit: values => {
      isLoading(true);
      const params = {
        userId: getUserInfo?.userInfo?.data?._id,
        verificationValue: values?.verificationValue
      }
      dispatch(gstVerify(params)).then((res) => {
        if (res?.payload?.status === true) {
          setGstSearchData(res?.payload?.data);
        } else {
          setGstSearchData([]);
        }
        isLoading(false);
      });
    },
  });


  const handleCancel = () => {
    setShowModal(false);
    setGstSearchData([]);
    formik.values.verificationValue = "";
    // formik.errors.verificationValue = "";
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }

  const onPostHandle = (getRow) => {
    isLoading(true);
    const reqeObj = {
      gstin: getRow.gstin,
      userId: getUserInfo?.userInfo?.data?._id,
      isMyBusiness: true,
      gstData: getRow,
    };

    dispatch(postGstRecord(reqeObj)).then((res) => {
      if (res?.payload?.status === true) {
        if (getUserInfo !== undefined && getUserInfo !== null) {
          navigate(`/gst-information/${getRow?.gstin || getRow?._doc?.gstin}`, {
            state: { getRow }
          });
        } else {
          navigate("/login");
        }
      }
      isLoading(false);
    });
  };

  return (
    <form>
        <div className="my-business-container py-5 px-lg-5 px-md-3">
        <h2 className="font-weight-bold pl-lg-5 pl-3">
          My Business
          <IconButton
            type="reset"
            className="ml-3 add-business-btn"
            onClick={() => setShowModal(true)}
          >
            <AddIcon />
          </IconButton>
        </h2>

        <div className="px-lg-4 py-5 row px-4 m-0">
          {myBusinessData?.length > 0 ? (
            <>
              {myBusinessData?.map((gst, index) => (
                <GstCard key={index} gst={gst} />
              ))}
            </>
          ) : (
            <div className="w-100 text-center">
              <h4 className="text-muted">No data</h4>
            </div>
          )}
        </div>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          backdrop="static"
          aria-labelledby="example-modal-sizes-title-lg"
          keyboard={false}
          centered
        >
          <Modal.Body className="mx-4">
          <h5 className="mt-3">Enter GST Number / Business Name</h5>
            <input
              type="text"
              placeholder="Enter GST No. / Name"
              className="mt-3 w-50 search-gst-modal"
              id="verificationValue"
              name="verificationValue"
              value={formik.values.verificationValue}
              onChange={formik.handleChange}
            />
            {formik.errors.verificationValue && (
              <div className="mt-1 ml-3">
                <span style={{ color: "red" }}>
                  {formik.errors.verificationValue}
                </span>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="modal-btn-container mr-auto mx-4 border-0">
            <button
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="btn-add"
              type="button"
              onClick={formik.handleSubmit}
            >
              Add
            </button>

          </Modal.Footer>
          <div className="my-business-search-container">
            {gstSearchData?.length > 0 && (
              <div className="px-lg-4 pt-4 mx-4 row px-4 m-0 mb-5">
                {gstSearchData.map((gst, index) => (
                  <GstCard
                    key={index}
                    gst={gst}
                    isMyBusiness={true}
                    myBusinessSearch={true}
                  />
                ))}
              </div>
            )}
          </div>
        </Modal>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  );
};

export default MyBusiness;
