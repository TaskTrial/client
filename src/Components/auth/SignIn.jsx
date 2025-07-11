import clipMessage from "../../assets/clip-message.png";
import "../Styles/Sign.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay";
// import googlePicture from "../../assets/google.png";
// import handleGoogleLogin from "../handleGoogleLogin";
import { useDispatch } from "react-redux";
import Toast from "../Toast";
import { login } from "../store/userSlice";
//////////////google use Oauthgoogle///////
import GoogleLoginButton from "../google/GoogleLoginButton";
function SignIn() {
  // const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   localStorage.setItem("auth", "true");
  //   navigate("/Home");
  // };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const handleReset = () => {
    setEmail("");
    setPassword("");
  };
  // const logIn = () => {
  //   handleGoogleLogin(setIsLoading, navigate, setToast);
  // window.open("http://localhost:3000/api/auth/google");
  // window.location.href = "http://localhost:3000/api/auth/google";
  // const response = await fetch("http://localhost:3000/api/auth/firebase", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   },
  //   // body: JSON.stringify({ idToken }),
  // });
  // console.log(response.JSON());
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const checkbox = document.getElementById("check");
    if (checkbox.checked) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    const credentials = {
      email: email.trim(),
      password: password.trim(),
    };
    if (password.length < 8) {
      setMessage({
        text: "Password must be at least 8 characters with letters and numbers",
        type: "error",
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        setToast({
          message: data.message || "logging successfully",
          type: "success",
        });
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(login(data));
        setMessage({ text: data.message, type: "success" });
        localStorage.setItem("auth", "true");
        setTimeout(() => {
          navigate("/Home");
        }, 1500);
        // if (orgid) {
        //   setTimeout(() => {
        //     navigate("/Home"); //because it rerender down in effect
        //   }, 1500);
        // } else {
        //   setTimeout(() => {
        //     navigate("/Home/CreateOrganization");
        //   }, 1500);
        // }
      }
      //  else if (response.status == 401) {
      //   alert(`Error: ${response.status} - ${response.statusText}`);}
      else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  // const isLogged = userData.isAuthenticated;
  // useEffect(() => {
  //   if (isLogged) {
  //     navigate("/Home");
  //   }
  // }, [isLogged, navigate]);
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      navigate("/home");
    }
  }, [navigate]);

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
      <LoadingOverlay isLoading={isLoading} />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="SignsignIn">
        <div className="Signview">
          <div className="Signcontent">
            <h3>Stay Focused, Stay Ahead! 🚀</h3>
            Every great project starts with a single step. Keep pushing forward,
            stay organized, and achieve more with TaskTrial. Log in and make
            progress happen!
          </div>
          <div className="Signimage">
            <img src={clipMessage} alt="not found" />
          </div>
        </div>
        <div className="Signfields">
          <div>
            <h1>Welcome Again!</h1>
            <h2>Login to your Account</h2>
            <p>See what is going on with your business</p>
          </div>
          {/* Google Button */}
          {/* <button onClick={loginWithGoogle} className="Signgoogle-btn">
            <img
              src={googlePicture}
              width="20px"
              height="20px"
              alt="googlePicture"
            />
            {isLoading ? "Loading..." : "Continue with Google"}
          </button> */}
          {/* google buton */}
          <GoogleLoginButton
            onSuccess={(result) => {
              dispatch(login(result));
              setToast({
                message: "Logged in successfully",
                type: "success",
              });
              localStorage.setItem("auth", "true");
              setTimeout(() => {
                navigate("/Home");
              }, 1500);
            }}
            onError={(err) => {
              setToast({
                message: err.message || "Google login failed",
                type: "error",
              });
            }}
            text="Continue with Google"
          />

          <div className="Signdivider">
            <span>----or Sign In with Email----</span>
          </div>
          {/* ////////////////////// */}
          <form
            className="Signform"
            onSubmit={handleSubmit}
            action=""
            method="post"
          >
            <label htmlFor="email"> Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <div className="Signpassword-wrapper">
              <input
                className="SignShow"
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="Signicon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <div className="SignforgetPassword">
              <div className="Sign-checed">
                <input type="checkbox" name="" id="check" />
                <label htmlFor="check">remember me</label>
              </div>
              <Link style={{ color: "var(--thirdColor)" }} to="/ForgetPassword">
                forget password?
              </Link>
            </div>
            <div className="SignsubmitForm">
              <input type="submit" value="Sign In" />
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
            Not Registered Yet?
            <Link style={{ color: "var(--thirdColor)" }} to="/SignUp">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
