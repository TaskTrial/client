/* eslint-disable react/prop-types */
import { TailSpin } from "react-loader-spinner";
function LoadingOverlay(props) {
  if (props.isLoading) {
    document.body.style;
  }
  return (
    <>
      {/* Loading Overlay */}
      {props.isLoading && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
            pointerEvents: "auto",
          }}
        >
          <TailSpin
            height={80}
            width={80}
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p style={{ marginTop: "20px" }}>Processing your request...</p>
        </div>
      )}
    </>
  );
}

export default LoadingOverlay;
