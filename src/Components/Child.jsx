/* eslint-disable react/prop-types */

function Child({ count }) {
  return (
    <div>
      <h2>hello from child</h2>
      <div>count is:{count[0]}</div>
      <button type="button" onClick={() => count[1]((pre) => pre + 1)}>
        click to increment
      </button>
      <button type="button" onClick={() => count[1](count[0] - 1)}>
        click to decrement
      </button>
      <button type="button" onClick={() => count[1](0)}>
        click to Reset
      </button>
    </div>
  );
}

export default Child;
