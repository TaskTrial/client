import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Styles/VerifyEmail.css";
import { TailSpin } from "react-loader-spinner";
function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const email =
    location.state?.email || localStorage.getItem("VerifyEmail") || "";

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setMessage({ text: "Please enter a valid 6-digit OTP", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/verifyEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: data.message || "Email verified successfully!",
          type: "success",
        });
        localStorage.removeItem("VerifyEmail");
        localStorage.setItem("auth", "true");
        setTimeout(() => navigate("/Home"), 1500);
      } else {
        setMessage({
          text: data.message || "Invalid or expired OTP",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  // reset otp
  //     const handleResendOtp = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await fetch("http://localhost:3000/api/auth/resend-otp", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email }),
  //       });

  //       const data = await res.json();

  //       if (res.ok) {
  //         setMessage({
  //           text: data.message || "OTP resent successfully!",
  //           type: "success",
  //         });
  //       } else {
  //         setMessage({
  //           text: data.message || "Failed to resend OTP",
  //           type: "error",
  //         });
  //       }
  //     } catch (err) {
  //       setMessage({ text: err.message, type: "error" });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
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
      <div className={`VerifyEmail ${isLoading ? "blur-content" : ""}`}>
        <div className="verify-card">
          <h2>Verify Your Email</h2>
          <p>We have sent a 6-digit verification code to {email}</p>

          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.toLowerCase().trim())}
                placeholder="Enter 6-digit code"
                maxLength="6"
                required
              />
            </div>

            <button className="button" type="submit">
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="resend-otp">
            <p>Did not receive the code?</p>
            {/* <button
                onClick={handleResendOtp}
              className="resend-btn button"
            >
              Resend OTP
            </button> */}
            <button
              className="resend-btn button"
              onClick={() => navigate("/SignIn")}
            >
              Back to Login
            </button>
          </div>

          {message.text && (
            <p className={`message ${message.type}`}>{message.text}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;
