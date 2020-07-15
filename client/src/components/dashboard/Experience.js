import React,{Fragment} from 'react';
import PropTypes from 'prop-types';  
import Moment from 'react-moment';
import {connect} from 'react-redux';


const Experience=({experience})=>{
const experiences=experience.map(exp => (
    <td key={exp._id}>
        <td>{exp.company}</td>
        <td className="hide-sm">{exp.title}</td>
        <td>
            <Moment format='YYY/MMM/DD'>{exp.from}</Moment> -{' '} 
               { exp.to===null ? ('Now') : (<Moment format='YYY/MMM/DD'>{exp.to}</Moment>)
            }
        </td>

         <td>
             <button className="btn danger">Delete</button>
         </td>

    </td>
))
 
    return(
        <Fragment>
        <h2 className='my-2'>Experience credentials</h2>
        <table className='table'>
            <thead>
                <tr>
                    <th>company</th>
                    <th className='hide-sm'>Title</th>
                    <th className='hide-sm'>Years</th>

                </tr>
            </thead>
            <tbody>{experiences}</tbody>
        </table>

        </Fragment>

    )
}
Experience.propTypes={
    experience:PropTypes.array.isRequired
}

export default Experience;