import {ACTION} from '../types';
// import console = require('console');
 
const INITIAL_STATE = {
  OTPLoading: false,
  authtoken:'',
  error: '',
  isOTPSent:false,
  login_loading:true
}

export default (state=INITIAL_STATE, action)=>{
  switch (action.type){

    case ACTION.LOGIN_ERROR:
      let isOTPSent = false;
      if (action.payload==='OTP is incorrect'){
        isOTPSent = true;
      }

      return {...state, error: action.payload, isOTPSent}

    case ACTION.SET_TOKEN:
      return {...state, authtoken:action.payload, login_loading:false}

    case ACTION.LOGIN_CLEAR_ERROR:
      return {...state, error:''}

    case ACTION.LOGIN_LOADING:
      return {...state, login_loading:action.payload}

    case ACTION.LOGIN_ISOTPSENT:
      return {...state, isOTPSent:action.payload}

    case ACTION.LOGIN_OTP_LOADING:
      return {...state, OTPLoading:action.payload}
    
    default:
      return state
  }
}