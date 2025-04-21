import styles from "../Styles/ResetPassword.module.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LoadingOverlay from "../LoadingOverlay";
function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const email =
    location.state?.email || localStorage.getItem("ResetEmail") || "";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toLowerCase().trim(),
    }));
  };
  const passwordValid = /(^[a-zA-Z0-9]{8,})/gi;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setIsLoading(false);
      return;
    }
    if (!passwordValid) {
      setMessage({
        text: "Password must be at least 8 characters with letters and numbers",
        type: "error",
      });

      setIsLoading(false);
      return;
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setMessage({ text: "Please enter a valid 6-digit OTP", type: "error" });
      setIsLoading(false);
      return;
    }
    const payload = {
      email: email,
      otp: formData.otp,
      newPassword: formData.newPassword,
    };
    try {
      const res = await fetch("http://localhost:3000/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          text: data.message || "Password reset successful",
          type: "success",
        });
        localStorage.removeItem("ResetEmail");
        setTimeout(() => navigate("/SignIn"), 1500);
        //  setFormData({ email: "", otp: "", newPassword: "" });
      } else {
        setMessage({ text: data.message || "Reset failed", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: error.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ${isLoading ? "Signblur-content" : ""} */}
      <LoadingOverlay isLoading={isLoading} />
      <div className={`${styles.page} ${isLoading ? styles.blurcontent : ""}`}>
        <div className={styles.container}>
          <h2 className={styles.h2}>Reset Password </h2>
          <p className={styles.p}>Enter your OTP, and new password to reset.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              name="otp"
              id="otp"
              required
              placeholder="Please enter a valid 6-digit OTP"
              className={styles.input}
              value={formData.otp}
              onChange={handleChange}
            />

            <label htmlFor="newPassword">New Password</label>
            <div className={styles["Signpassword-wrapper"]}>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="enter your new password"
                required
                className={styles.input}
                value={formData.newPassword}
                onChange={handleChange}
              />
              <span
                className={styles.Signicon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <label htmlFor="confirmPassword">confirm Password</label>
            <div className={styles["Signpassword-wrapper"]}>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="write password again!"
                required
                className={styles.input}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className={styles.Signicon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button type="submit" className={styles.button}>
              Reset Password
            </button>
            <button
              style={{ marginTop: "10px" }}
              className={styles.button}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => navigate("/ForgetPassword"), 1500);
                setIsLoading(false);
              }}
            >
              Back to Forget password
            </button>
            {message.text && (
              <p
                className={
                  message.type === "error" ? styles.error : styles.success
                }
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
