import React from "react";
import OtpInput from "react-otp-input";
import "./OtpViewComponents.scss";
const OtpViewComponents = (props) => {
  const { otp, handleChange } = props;
  return (
    <div className="text-center">
      <OtpInput
        value={otp}
        onChange={handleChange}
        numInputs={6}
        containerStyle={"container-style"}
        inputStyle={"input-style"}
        focusStyle={"input-style"}
      />
    </div>
  );
};

export default OtpViewComponents;
