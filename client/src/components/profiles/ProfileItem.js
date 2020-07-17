import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem=({
  profile:{
      user:{_id,name,avatar},
      status,
      company,
      location,
      skills
  }

})=>{
    return <div className="profile bg-light">
    <img src={avatar} alt="" className="round-img" />
    <div>
        <h2>{name}</h2>
        <p>{status} {company && <span>{location}</span>}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">View Profile</Link>
    </div>
    <ul>
        {skills.slice(0,4).map((skill,index)=>(skill,index)=>(
            <li key={index} className="text-primary"><i className="fas fa-check"></i>{skill}</li>
        ))}
    </ul>

    </div>
}

ProfileItem.propType={
profile:PropTypes.object.isRequired
}

export default ProfileItem;