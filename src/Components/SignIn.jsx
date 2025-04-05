import clipMessage from "../assets/clip-message.png";
import "./Styles/SignIn.css";
import { Link } from "react-router-dom";

function SignIn() {
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
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>
          <div className="divider">
            <span>----or Sign In with Email----</span>
          </div>
          {/* ////////////////////// */}
          <form action="" method="post">
            <label htmlFor="email"> Email:</label> <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="enter your email"
              required
            />
            <label htmlFor="username">Password:</label> <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter your password"
              required
            />
            <div className="forgetPassword">
              <input type="checkbox" name="" id="" />
              <Link style={{ color: "var(--thirdColor)" }} to="/SignUp">
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
            <Link style={{ color: "var(--thirdColor)" }} to="/">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
