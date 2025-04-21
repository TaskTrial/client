import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/ForgetPassword.module.css";
import LoadingOverlay from "../LoadingOverlay";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    setIsLoading(true);
    if (!email) {
      setMessage({ text: "Please enter your email", type: "error" });
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage({
          text: "OTP has been sent to your email",
          type: "success",
        });
        localStorage.setItem("ResetEmail", email);
        setTimeout(
          () => navigate("/ResetPassword", { state: { email: email } }),
          1500
        );
      } else {
        const data = await res.json();
        setMessage({
          text: data.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: error.message || "Failed to connect to the server",
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
      <div className="body">
        <div className={styles.ForgotPassword}>
          <h2 className={styles.title}>Forgot Password</h2>
          <p style={{ color: "var(--colorParagraph)", marginBottom: "20px" }}>
            please enter your email address to reset password
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          />
          <button className={styles.button} onClick={handleSendOTP}>
            Send OTP
          </button>
          <button
            style={{ marginTop: "10px" }}
            className={styles.button}
            onClick={() => navigate("/SignIn")}
          >
            Back to Login
          </button>
          {message.text && (
            <p style={{ color: message.type === "error" ? "red" : "green" }}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
