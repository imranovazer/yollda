import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomInput2 = ({ errors, handleInputChange }) => {
  const handleChange = (val, country) => {
    if (!val) {
      handleInputChange("countryCode", "");
      handleInputChange("phoneNumber", "");
      return;
    }

    const dialCode = `+${country.dialCode}`;
    const numberWithoutDial = val.slice(country.dialCode.length).trim();

    handleInputChange("countryCode", dialCode);
    handleInputChange("phoneNumber", numberWithoutDial);
  };

  return (
    <PhoneInput
      country={"az"}
      onChange={handleChange}
      inputClass={`${
        errors.phoneNumber ? "border-red-400" : "border-gray-300"
      }`}
      dropdownClass="custom-contact-scrollbar"
    />
  );
};

export default CustomInput2;
