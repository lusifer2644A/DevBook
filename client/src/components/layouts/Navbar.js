import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { Fragment } from "react";

const Navbar = ({ auth: { isAuthenticated, isLoading }, logout }) => {
  const guestLinks = (
    <>
      {" "}
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </>
  );

  const authLinks = (
    <li>
      <a onClick={logout} href="#!">
        <i className="fas fa-sign-out-alt"></i>
        <span className="hide-sm"> Logout</span>
      </a>
    </li>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevBook
        </Link>
      </h1>
      <ul>
        {!isLoading && (
          <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        )}
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
