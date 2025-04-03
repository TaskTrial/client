import clipMessage from "../assets/clip-message.png";
import "./Styles/SignIn.css";
import { Link } from "react-router-dom";
function SignUp() {
  return (
    <>
      <div className="signup">
        <div className="view">
          <div className="content">
            <h3>Boost Your Productivity with Jira! 🚀</h3>
            Join now to streamline your projects, collaborate seamlessly, and
            stay on top of your tasks. Sign in and take your workflow to the
            next level!
          </div>
          <div className="image">
            <img
              src={clipMessage}
              alt="not found"
              width="800px"
              height="500px"
            />
          </div>
        </div>
        <div className="fields">
          <div>
            <h1>Sign Up</h1>
            <p>See what is going on with your business</p>
          </div>
          <form action="" method="post">
            <label htmlFor="username">User Name:</label> <br />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="enter your name"
            />
            <label htmlFor="email"> Email:</label> <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="enter your email"
            />
            <label htmlFor="username">Password:</label> <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter your password"
            />
            <label htmlFor="confirm">Confirm Password:</label> <br />
            <input
              type="password"
              name="confirm"
              id="confirm"
              placeholder="please enter password again"
            />
            <div className="submitForm">
              <input type="submit" value="Sign UP" />
              <input type="reset" value="Clear" />
            </div>
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
