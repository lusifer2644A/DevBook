import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { deleteExperience } from "../../actions/profile";
import { connect } from "react-redux";

const Experience = ({ experience, deleteExperience }) => {
  const experienceBody = experience.map((exp) => {
    return (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td className="hide-sm">{exp.title}</td>
        <td className="hide-sm">
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> -{" "}
          {exp.to === null ? (
            "Now"
          ) : (
            <Moment format="DD/MM/YYYY">{exp.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={(e) => deleteExperience(exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <h2 className="my-2">Experiences</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>
        <tbody>{experienceBody}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
