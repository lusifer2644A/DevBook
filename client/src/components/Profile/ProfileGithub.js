import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getGithubRepos } from "../../actions/profile";
import Loader from "../layouts/Loader";

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {repos == null ? (
        <Loader />
      ) : (
        repos.map((repo) => (
          <div key={repo._id} className="repo bg-white my-1 p-1">
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul style={{ display: "flex", flexDirection: "row" }}>
                <li className="badge">
                  <i class="far fa-star"></i> {repo.stargazers_count}
                </li>
                <li className="badge">
                  <i class="far fa-eye"></i> {repo.watchers_count}
                </li>
                <li className="badge">
                  <i class="fas fa-code-branch"></i> {repo.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
