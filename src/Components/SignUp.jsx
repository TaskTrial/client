import clipMessage from "../assets/clip-message.png";
import "./Styles/Sign.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
//import { useAuth } from "../../contexts/AuthContext";
function SignUp() {
  //const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.toLowerCase().trim(),
    }));
  };

  const generateUsername = () => {
    const random = Math.floor(Math.random() * 1000);
    return `${formData.firstName}${formData.lastName}${random}`;
  };

  // const handleGoogleSignUp = async () => {
  //   try {
  //     setIsLoading(true);
  //     await googleSignIn();
  //      navigate("/VerifyEmail");
  //   } catch (error) {
  //     setMessage({ text: error.message, type: "error" });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
        text: "email not valid",
        type: "error",
      });
      setIsLoading(false);
      return;
    }
    const username = generateUsername();
    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: username,
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
      console.log(data);
      console.log(res);
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
      <div className={`signup ${isLoading ? "blur-content" : ""}`}>
        <div className="view">
          <div className="content">
            <h3>Boost Your Productivity with Jira! 🚀</h3>
            Join now to streamline your projects, collaborate seamlessly, and
            stay on top of your tasks. Sign in and take your workflow to the
            next level!
          </div>
          <div className="image">
            <img src={clipMessage} alt="not found" />
          </div>
        </div>
        <div className="fields">
          <div>
            <h1 style={{ marginBottom: "0" }}>Sign Up</h1>
            <p>See what is going on with your business</p>
          </div>
          {/* Google Button */}
          <button
            className={"google-btn"}
            // onClick={handleGoogleSignUp}
            // disabled={isLoading}
          >
            <FaGoogle className="google-icon" />
            {isLoading ? "Loading..." : "Continue with Google"}
          </button>
          <div className="divider">
            <span>----or Sign up with Email----</span>
          </div>
          {/* ////////////////////// */}
          <form onSubmit={handleSubmit} action="" method="post">
            <label htmlFor="firstname">First Name:</label> <br />
            <input
              type="text"
              name="firstName"
              id="firstname"
              placeholder="enter your first name"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <label htmlFor="lastname">Last Name:</label> <br />
            <input
              type="text"
              name="lastName"
              id="lastname"
              placeholder="enter your last name"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
            <label htmlFor="email"> Email:</label> <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="password">Password:</label> <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="confirm">Confirm Password:</label> <br />
            <input
              type="password"
              name="confirmPassword"
              id="confirm"
              placeholder="please enter password again"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <div className="submitForm">
              <input type="submit" value="Sign UP" />
              <input type="reset" value="Clear" />
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
