import clipMessage from "../assets/clip-message.png";
import "./Styles/Sign.css";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function SignIn() {
  const navigate = useNavigate();
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   localStorage.setItem("auth", "true");
  //   navigate("/Home");
  // };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        // throw new Error(`Error: ${response.status} - ${response.statusText}`);
        console.log(`Error: ${response.status} - ${response.statusText}`);
      }
      if (response.ok) {
        // Store the tokens in localStorage or cookies
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Store the user details
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to home (dashboard initial home page)
        localStorage.setItem("auth", "true");
        navigate("/Home");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };
  return (
    <>
      <div className="signIn">
        <div className="view">
          <div className="content">
            <h3>Stay Focused, Stay Ahead! 🚀</h3>
            Every great project starts with a single step. Keep pushing forward,
            stay organized, and achieve more with TaskedIn. Log in and make
            progress happen!
          </div>
          <div className="image">
            <img src={clipMessage} alt="not found" />
          </div>
        </div>
        <div className="fields">
          <div>
            <h1>Welcome Again!</h1>
            <h2>Login to your Account</h2>
            <p>See what is going on with your business</p>
          </div>
          {/* Google Button */}
          <button className="google-btn">
            <FaGoogle className="google-icon" />
            Continue with Google
          </button>
          <div className="divider">
            <span>----or Sign In with Email----</span>
          </div>
          {/* ////////////////////// */}
          <form onSubmit={handleSubmit} action="" method="post">
            <label htmlFor="email"> Email:</label> <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
            />
            <label htmlFor="password">Password:</label> <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value.toLowerCase().trim())}
            />
            <div className="forgetPassword">
              <div>
                <input type="checkbox" name="" id="check" />
                <label htmlFor="check">remember me</label>
              </div>
              <Link style={{ color: "var(--thirdColor)" }} to="/ForgetPassword">
                forget password?
              </Link>
            </div>
            <div className="submitForm">
              <input type="submit" value="Sign In" />
              <input type="reset" value="Clear" />
            </div>
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
