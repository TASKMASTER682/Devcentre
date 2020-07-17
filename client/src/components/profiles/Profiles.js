import React,{Fragment,usEffect,  useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getAllProfiles} from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';


const Profiles=({getAllProfiles,profile:{profiles,loading}})=>{
    useEffect(()=>{
        getAllProfiles()
    },[]);

    return(
        <Fragment>
           {loading ? <Spinner />:<Fragment>
               <h1 className="large text-primary">Developers</h1>
               <p className="lead"><i className="fab fa-connectdevelop"></i>Browse and Connect with developers</p>
               <div className="profiles">
                  {profiles.length>0 ? (profiles.map(profile=>(<ProfileItem key={profile._id} profile={profile} />))
                  
                  ):<h4>No profile found</h4>
                  };
               </div>
           </Fragment>}
        </Fragment>

    )
}





Profiles.propTypes={
    setProfiles:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired
};

const mapStateToProps=state=>({
    profile:state.profile
})

export default connect(mapStateToProps,{getAllProfiles,})(Profiles)