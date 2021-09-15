import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_FAIL,
  REGISTER_SUCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";

import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);

  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post("/api/users", body, config);
      console.log(res.data);
      dispatch({
        type: REGISTER_SUCESS,
        payload: res.data, //token
      });

      dispatch(loadUser());
    } catch (err) {
      console.error("This is errors", err);
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);
    dispatch({
      type: LOGIN_SUCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    console.error("There is login error", err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
  dispatch({
    type: CLEAR_PROFILE,
  });
};
