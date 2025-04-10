import styles from "./Styles/ResetPassword.module.css";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
function ResetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toLowerCase().trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.newpassword !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setIsLoading(false);
      return;
    }
    const payload = {
      email: formData.email,
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
      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingoverlay}>
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
      <div className={`${styles.page} ${isLoading ? styles.blurcontent : ""}`}>
        <div className={styles.container}>
          <h2 className={styles.h2}>Reset Password </h2>
          <p className={styles.p}>
            Enter your email, OTP, and new password to reset.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="otp">OTP:</label>
            <input
              type="text"
              name="otp"
              id="otp"
              required
              className={styles.input}
              value={formData.otp}
              onChange={handleChange}
            />

            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              required
              className={styles.input}
              value={formData.newPassword}
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button type="submit" className={styles.button}>
              Reset Password
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
