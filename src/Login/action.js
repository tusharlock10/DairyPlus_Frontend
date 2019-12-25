import axios from 'axios'
import {ACTION} from '../types';
import {Alert, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {BASE_URL, HTTP_TIMEOUT, URLS} from '../Constants';

const httpClient = axios.create();

httpClient.defaults.timeout = HTTP_TIMEOUT;
httpClient.defaults.baseURL = BASE_URL;


export const checkLogin = () => {
  return (dispatch) => {
    AsyncStorage.getItem('authtoken').then((response) => {
      if (response){
        dispatch({type:ACTION.SET_TOKEN, payload:response});
        AsyncStorage.getItem(response).then((cart)=>{
          if (cart){
            dispatch({type:ACTION.SET_CART, payload:JSON.parse(cart)});
          }
        })
        AsyncStorage.getItem('theme').then((response)=>{
          dispatch({type:ACTION.SET_THEME, payload:response})
          Actions.replace('main')
        })
      }
      else{
        dispatch({type:ACTION.LOGIN_LOADING, payload:false})
      }
    })
  }
}


const checkData = (type, data) => {
  if (data.phone.length!==10){
    Alert.alert('Phone number should have 10 digits');
    return false
  }
  if (type==='register'){
    const re = /\S+@\S+\.\S+/;
    if (!re.test(data.email)){
      Alert.alert('Invalid email address. Please recheck your email');
      return false
    }
    if (data.address.length<15){
      Alert.alert('Address too short. Please add more information');
      return false
    }
  }
  return true
}

export const resetOTPSent = () => {
  return {type:ACTION.LOGIN_ISOTPSENT, payload:false}
}

export const loginAction = (type, data) => {
  return (dispatch) => {
    const isDataCorrect = checkData(type, data)

    if (!isDataCorrect){
      return null
    }

    if (type==='login'){
      dispatch({type:ACTION.LOGIN_OTP_LOADING, payload: true})
      httpClient.post(URLS.login, data).then((response)=>{
        if (response.data.error){
          dispatch({type:ACTION.LOGIN_ERROR, payload: response.data.error})
        }
        else if (response.data.token){
          dispatch({type:ACTION.SET_TOKEN, payload:response.data.token});
          AsyncStorage.setItem('authtoken', response.data.token)
          Actions.replace('main')
        }
        else{
          if (isDataCorrect && !data.otp){
            dispatch({type:ACTION.LOGIN_ISOTPSENT , payload:true})
          }
        }
        dispatch({type:ACTION.LOGIN_OTP_LOADING, payload: false})
      })
      .catch((e)=>{Alert.alert("Got error: ", e.toString())})
    }
    else{
      
      dispatch({type:ACTION.LOGIN_OTP_LOADING, payload: true})
      httpClient.post(URLS.register, data).then((response)=>{
        if (response.data.error){
          dispatch({type:ACTION.LOGIN_ERROR, payload: response.data.error})
        }
        else if (response.data.token){
          dispatch({type:ACTION.SET_TOKEN, payload:response.data.token});
          AsyncStorage.setItem('authtoken', response.data.token)
          Actions.replace('main')
        }
        else{
          if (isDataCorrect && !data.otp){
            dispatch({type:ACTION.LOGIN_ISOTPSENT , payload:true})
          }
        }
        dispatch({type:ACTION.LOGIN_OTP_LOADING, payload: false})
      })
    }
  }
}

export const clearError = () => {
  return {type:ACTION.LOGIN_CLEAR_ERROR}
}

export const get_cart = (authtoken) => {
  return (dispatch)=>{
    
  }
}