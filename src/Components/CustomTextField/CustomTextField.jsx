import React from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "../../Pages/Login/Login.scss";
// const CustomTextField = ({ field, form: { touched, errors }, ...props }) => {
const CustomTextField = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <>
      {field?.name === "password" ? (
        <FormControl variant="outlined">
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={props.handleClickShowPassword}
                  onMouseDown={props.handleMouseDownPassword}
                  edge="end"
                >
                  {props.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            {...field}
            {...props}
          />
        </FormControl>
      ) : (
        <FormControl variant="outlined">
          <TextField type="text" {...field} {...props} />
        </FormControl>
      )}
      <div className="invalid-feedback" style={{ display: "flex" }}>
        {/* {errors[field.name] && errors[field.name] ? errors[field.name] : null} */}
        {touched[field.name] && errors[field.name] && (
          <div className="error">{errors[field.name]}</div>
        )}
      </div>
    </>
  );
};

export default CustomTextField;
