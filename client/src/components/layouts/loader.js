/* eslint-disable import/no-anonymous-default-export */
import { Fragment } from "react";
import spinner from "./loader.gif";

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