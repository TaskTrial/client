import clipMessage from "../../assets/clip-message.png";
import googlePicture from "../../assets/google.png";
import "../Styles/Sign.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import handleGoogleLogin from "../handleGoogleLogin";
import LoadingOverlay from "../LoadingOverlay";
import Toast from "../Toast";

function SignUp() {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const handleReset = () => {
    setFormData({
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    // if (e.target.name === "userName") {
    //   setFormData((prev) => ({
    //     ...prev,
    //     [e.target.name]: e.target.value.toLowerCase(),
    //   }));}

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const generateUsername = () => {
  //   const random = Math.floor(Math.random() * 1000);
  //   return `${formData.firstName}${formData.lastName}${random}`;
  // };

  const logIn = () => {
    handleGoogleLogin(setIsLoading, navigate, setToast);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    const passwordValid = /(^[a-zA-Z0-9]{8,})/gi;
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setIsLoading(false);
      return;
    }
    if (!passwordValid.test(formData.password)) {
      setMessage({
        text: "Password must be at least 8 characters with letters and numbers",
        type: "error",
      });
      setIsLoading(false);
      return;
    }
    if (!emailValid.test(formData.email)) {
      setMessage({
        text: "Email not valid",
        type: "error",
      });
      setIsLoading(false);
      return;
    }
    //const username = generateUsername();
    const payload = {
      email: formData.email.toLowerCase().trim(),
      password: formData.password.toLowerCase().trim(),
      firstName: formData.firstName.toLowerCase().trim(),
      lastName: formData.lastName.toLowerCase().trim(),
      username: formData.userName.toLowerCase().trim(),
    };
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      //testing
      console.log(data);
      console.log(res);
      ///////
      if (res.ok) {
        localStorage.setItem("VerifyEmail", formData.email);
        setMessage({ text: data.message, type: "success" });
        navigate("/VerifyEmail", { state: { email: formData.email } });
      } else {
        setMessage({
          text: data.message || "Signup failed",
          type: "error",
        });
      }
    } catch (err) {
      setMessage({
        text: err.message || "Something went wrong!",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);
  return (
    <>
      {/* ${isLoading ? "Signblur-content" : ""} */}
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className={`Signsignup`}>
        <div className="Signview">
          <div className="Signcontent">
            <h3>Boost Your Productivity with TaskTrial! 🚀</h3>
            Join now to streamline your projects, collaborate seamlessly, and
            stay on top of your tasks. Sign in and take your workflow to the
            next level!
          </div>
          <div className="Signimage">
            <img src={clipMessage} alt="not found" />
          </div>
        </div>
        <div className="Signfields">
          <div>
            <h1 style={{ marginBottom: "0" }}>Sign Up</h1>
            <p>See what is going on with your business</p>
          </div>
          {/* Google Button */}
          <button
            onClick={logIn}
            className={"Signgoogle-btn"}
            // onClick={handleGoogleSignUp}
            // disabled={isLoading}
          >
            <img
              src={googlePicture}
              width="20px"
              height="20px"
              alt="googlePicture"
            />
            {isLoading ? "Loading..." : "Continue with Google"}
          </button>
          <div className="Signdivider">
            <span>----or Sign up with Email----</span>
          </div>
          {/* ////////////////////// */}
          <form
            className="Signform"
            onSubmit={handleSubmit}
            action=""
            method="post"
          >
            <div className="SignfirstLast">
              <div>
                <label
                  style={{ color: "var(--colorParagraph)" }}
                  htmlFor="firstname"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstname"
                  placeholder="Enter your first name:Joe"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastname">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastname"
                  placeholder="Enter your last name:Doe"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="userName"
              id="username"
              placeholder="Enter your username:JoeDoe"
              required
              value={formData.userName}
              onChange={handleChange}
            />
            <label htmlFor="email"> Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password">Password:</label>
            <div className="Signpassword-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
              />

              <span
                className="Signicon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <label htmlFor="confirm">Confirm Password:</label>
            <div className="Signpassword-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirm"
                placeholder="please Enter password again"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <span
                className="Signicon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="SignsubmitForm">
              <input type="submit" value="Sign UP" />
              <input type="reset" value="Clear" onClick={handleReset} />
            </div>
            {message.text && (
              <p
                style={{
                  color: message.type === "error" ? "red" : "green",
                  textAlign: "center",
                }}
              >
                {message.text}
              </p>
            )}
          </form>
          <div>
            Have an account?
            <Link style={{ color: "var(--thirdColor)" }} to="/SignIn">
              sign-in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
