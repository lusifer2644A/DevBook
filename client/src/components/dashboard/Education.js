import React, { Fragment } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { deleteEducation } from "../../actions/profile";
import { connect } from "react-redux";

const Education = ({ education, deleteEducation }) => {
  const educationBody = education.map((edu) => {
    return (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td className="hide-sm">{edu.degree}</td>
        <td className="hide-sm">
          <Moment format="DD/MM/YYYY">{edu.from}</Moment> -{" "}
          {edu.to === null ? (
            "Now"
          ) : (
            <Moment format="DD/MM/YYYY">{edu.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={(e) => deleteEducation(edu._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <h2 className="my-2">Education</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>
        <tbody>{educationBody}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
