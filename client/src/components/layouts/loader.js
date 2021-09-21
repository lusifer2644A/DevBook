import { Fragment } from "react";
import spinner from "./spinner.gif";

const Loader = () => {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{
          width: "3em",
          display: "block",
          margin: "auto",
        }}
        alt="loading..."
      />
    </Fragment>
  );
};

export default Loader;
