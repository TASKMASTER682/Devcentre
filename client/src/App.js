import React,{Fragment,useEffect} from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Landing from './components/layout//Landing';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
//Redux
import {Provider} from 'react-redux';
import store from './store';

import './App.css';
if(localStorage.token){
  setAuthToken(localStorage.token);

}

const App=()=> {
  //we use this because we need a logic of a function that is declared in anither file.so we dispatch it through store
  useEffect(() => {
    store.dispatch(loadUser());
  },[]);
  return(
<Provider store={store}>
   <Router>
    <Fragment>
      <Navbar />
      <Route exact path ='/' component={Landing}/> 
      <section className='container' >
     
      <Alert />
        <Switch>
        <Route exact path ='/register' component={Register}/>
        <Route exact path ='/login' component={Login}/>
        <PrivateRoute exact path ='/dashboard' component={Dashboard}/>
        <PrivateRoute exact path ='/create-profile' component={CreateProfile}/>
        <PrivateRoute exact path ='/edit-profile' component={EditProfile}/>
        <PrivateRoute exact path ='/add-experience' component={AddExperience}/>
        <PrivateRoute exact path ='/add-education' component={AddEducation}/>

        </Switch>
      </section>
    </Fragment>
 </Router>
 </Provider>
 )}

export default App;
