import {REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT,} from '../actions/types';

const initialState={
    token:localStorage.getItem('token'),
    //by default authenticated is null
    isAuthenticated:null,
    loading:true,
    //by default dont show user data untill user not authicated or logged in
    user:null
}

export default function(state=initialState,action){
    const {type,payload}=action;
    switch(type){
        //USER LOADED
        case  USER_LOADED:
            return {
                ...state,
                isAuthenticated:true,
                loading:false,
                user:payload
            } 
           


        //both will do same work so write them like this
      case REGISTER_SUCCESS:
      case  LOGIN_SUCCESS:
          localStorage.setItem('token',payload.token);
          return{
              ...state,
              ...payload,
              isAuthenticated:true,
              loading:false
          }
          //BELOW SHOWN  CASES DO SAME WORK
          case REGISTER_FAIL:
          case LOGIN_FAIL:   
          case LOGOUT: 
              case AUTH_ERROR:
              localStorage.removeItem('token');
              return{
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false
              }
             
              default:
                  return state;
    }
}

