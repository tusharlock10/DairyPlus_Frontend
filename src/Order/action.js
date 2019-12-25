import {ACTION} from '../types';
import {URLS, HTTP_TIMEOUT, BASE_URL} from '../Constants';
import axios from 'axios';
// import console = require('console');

// Bullshit to do in evey file ->
const httpClient = axios.create();

httpClient.defaults.timeout = HTTP_TIMEOUT;
httpClient.defaults.baseURL = BASE_URL;

export const setAuthToken = () => {
  return (dispatch, getState) => {
    const state = getState();
    httpClient.defaults.headers.common['Authorization'] = state.login.authtoken;
    dispatch({type:null})
  }
}
// till here

export const getIncompleteOrders = () => {
  return (dispatch) => {
    httpClient.get(URLS.get_incomplete_orders).then((response)=>{
      orders = response.data.orders.reverse();
      dispatch({type:ACTION.GET_INCOMPLETE_ORDERS, payload:orders})
    });
  }
}

export const changeButtonGroupIndex = (index, fetch_completed_orders) => {
  return (dispatch) => {
    if (index===1 && fetch_completed_orders){
      httpClient.get(URLS.get_completed_orders).then((response)=>{
        orders = response.data.orders.reverse();
        dispatch({type:ACTION.GET_COMPLETED_ORDERS, payload:{orders,index}});
      });
    }
    else{
      dispatch({type:ACTION.ORDER_CHANGE_BTN_GROUP_INDEX, payload: index})
    }
  }
}

export const refreshOrders = (index) => {
  return (dispatch)=>{
    dispatch({type:ACTION.ORDERS_REFRESHING})
    if (index===0){
      httpClient.get(URLS.get_incomplete_orders).then((response)=>{
        orders = response.data.orders.reverse();
        dispatch({type:ACTION.GET_INCOMPLETE_ORDERS, payload:orders})
      });
    }
    else if (index===1){
      httpClient.get(URLS.get_completed_orders).then((response)=>{
        orders = response.data.orders.reverse();
        dispatch({type:ACTION.GET_COMPLETED_ORDERS, payload:{orders,index}});
      });
    };
  }
}