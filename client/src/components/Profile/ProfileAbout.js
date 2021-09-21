import React, { Fragment } from "react";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => {
  return (
    <div class="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 class="text-primary">{name.trim().split(" ")[0]}s Bio</h2>
          <p>{bio}</p>
        </Fragment>
      )}

      <div class="line"></div>
      <h2 class="text-primary">Skill Set</h2>
      <div class="skills">
        {skills.map((skill) => {
          return (
            <div class="p-1" key="1">
              <i class="fa fa-check"></i> {skill}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = {};

export default ProfileAbout;
