import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useAppDispatch, useAppSelector } from "../../Redux/Store/Store";
import { getOurBusiness } from "../../Redux/Reducers/SearchGstNumReducer";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import axios from "axios";
import Select from "react-select";
import { json } from "react-router-dom";
import debounce from "lodash.debounce";
import { FormControl, MenuItem } from "@mui/material";
import { DebounceInput } from "react-debounce-input";
import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";
import { TextField, Autocomplete } from "@mui/material";

const OurBusiness = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [ourBusinessData, setOurBusinessData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const takeUserInfo = localStorage.getItem("userInfo");
  const getUserInfo = JSON.parse(takeUserInfo);
  const auth = getUserInfo?.userInfo?.token;

  useEffect(() => {
    ourBusinessHandler();
  }, []);

  const ourBusinessHandler = async (updatedSelectedState) => {
    setIsLoading(true);
    const data = {
      companyName: searchText ? searchText : "",
      state: updatedSelectedState ? updatedSelectedState : [],
      city: [],
    };
    dispatch(getOurBusiness(data))
      .then((res) => {
        if (res?.payload?.data) {
          setOurBusinessData(res?.payload?.data);
          setTotalPage(res?.payload?.TotalPage);
        } else {
          setOurBusinessData([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const debouncedOurBusinessHandler = debounce(ourBusinessHandler, 1000);
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    debouncedOurBusinessHandler();
  };

  const handleStateChange = (event, values) => {
    const selectedStateNames = values.map((value) => value.stateName);
    setSelectedState(selectedStateNames);
    ourBusinessHandler(selectedStateNames);
  };

  const handleCityChange = (event, values) => {
    const selectedCityValues = values.map((option) => option.value);
    setSelectedCity(selectedCityValues);
  };

  useEffect(() => {
    const fetchStates = async () => {
      
      try {
        const response = await axios.get(
          "https://wa-gst-api.onrender.com/api/v1/state/all",
          {
            headers: {
              Authorization: auth,
            },
          }
        );

        const stateOptions = response.data?.states.map((state) => ({
          stateName: state.stateName,
        }));
        setStateOptions(stateOptions);

      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
  
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const response = await axios.get(
            `https://wa-gst-api.onrender.com/api/v1/state/city/$`,
            {
              headers: {
                Authorization: auth,
              },
            }
          );
          const cityOptions = response.data.map((city) => ({
            value: city.id,
            label: city.name,
          }));
          setCityOptions(cityOptions);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setCityOptions([]);
      }
    };

    fetchStates();
    fetchCities();
  }, [selectedState]);

  const stateData = ourBusinessData.map(
    (data) => data?.gstData?.pradr?.addr?.stcd
  );
  const cityData = ourBusinessData.map(
    (data) => data?.gstData?.pradr?.addr?.dst
  );
  const CompanyName = ourBusinessData.map((data) => data?.gstData?.lgnm);

  const tableData = ourBusinessData.map((data, index) => ({
    companyName: CompanyName[index],
    state: stateData[index],
    city: cityData[index],
  }));

  const columns = [
    {
      name: "CompanyName",
      selector: "companyName",
      sortable: true,
    },
    {
      name: "State",
      selector: "state",
      sortable: true,
    },
    {
      name: "City",
      selector: "city",
      sortable: true,
    },
  ];

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
      <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <TextField
            size="small"
            label="Search by Company Name"
            variant="outlined"
            value={searchText.toUpperCase()}
            onChange={handleSearchChange}
            fullWidth
            style={{ margin: "5px", width: 300 }}
          />
        </div>
        <div style={{ flex: 1, marginLeft: "1rem" }}>
          <Autocomplete
            sx={{ m: 1 }}
            multiple
            options={stateOptions}
            getOptionLabel={(option) => option.stateName}
            onChange={handleStateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                label="Select State"
                placeholder="Select State"
                style={{ width: 300 }}
              />
            )}
          />
        </div>
        <div style={{ flex: 1, marginLeft: "1rem" }}>
          <Autocomplete
            sx={{ m: 1 }}
            multiple
            options={cityOptions}
            getOptionLabel={(option) => option.label}
            onChange={handleCityChange}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                label="Select City"
                placeholder="Select City"
                style={{ width: 300 }}
              />
            )}
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        paginationPerPage={10}
        paginationTotalRows={totalPage}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        responsive
        striped
        progressPending={!ourBusinessData.length && isLoading}
        progressComponent={<div>Loading...</div>}
        noDataComponent={<div>No data available</div>}
      />
    </div>
  );
};

export default OurBusiness;
