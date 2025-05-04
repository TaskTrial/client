/* eslint-disable react/prop-types */
import { TailSpin } from "react-loader-spinner";

const SmallSpinner = ({ size = 20, color = "#fff" }) => {
  return (
    <TailSpin
      height={size}
      width={size}
      color={color}
      ariaLabel="loading"
      radius="1"
      visible={true}
    />
  );
};

export default SmallSpinner;
