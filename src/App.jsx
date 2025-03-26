// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import { Fragment } from "react";
import Child from "./Components/Child";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setcount] = useState(0);
  return (
    <>
      <div>count is:{count}</div>
      <button type="button" onClick={() => setcount((pre) => pre + 1)}>
        click to increment
      </button>
      <button type="button" onClick={() => setcount(count - 1)}>
        click to decrement
      </button>
      <Child count={[count, setcount]} />
    </>
  );
}

export default App;
