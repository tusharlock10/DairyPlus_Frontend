import axios from 'axios'
import {ACTION} from '../types';
import {BASE_URL, HTTP_TIMEOUT, URLS} from '../Constants';
import { Actions } from 'react-native-router-flux';

// Bullshit to do in evey file ->
const httpClient = axios.create();

httpClient.defaults.timeout = HTTP_TIMEOUT;
httpClient.defaults.baseURL = BASE_URL;
var global_authtoken = ""

export const setAuthToken = () => {
  return (dispatch, getState) => {
    const state = getState();
    httpClient.defaults.headers.common['Authorization'] = state.login.authtoken;
    global_authtoken = state.login.authtoken;
    global.authtoken = global_authtoken
    dispatch({type:null})
  }
}
// till here

export const getProducts = () => {
  return (dispatch)=>{
    httpClient.get(URLS.getproducts).then((response)=>{
      products_obj = {}
      response.data.map((obj)=>{
        products_obj[`${obj._id}`] = obj
      });
      dispatch({type:ACTION.HOME_GET_PRODUCTS, payload:{products:response.data, products_obj}});
    })
  }
}

export const modifyProductInCart = (mode, product_id, amount, selling_price, quantity="") => {
  if (quantity.toString().length===0){
    quantity = ""
  }
  return {type:ACTION.CART_MODIFY_PRODUCT, 
    payload:{mode, product_id, amount, quantity, selling_price, authtoken: global_authtoken}}

}

export const changeTab = (tab_name, current_tab) => {
  if (tab_name===current_tab){
    return {type:null};
  };
  Actions.replace(tab_name);
  return {type:ACTION.CHANGE_TAB, payload:tab_name}
}

export const toggleTheme = () => {
  return {type: ACTION.SETTINGS_TOGGLE_THEME}
}

export const getSettings = () => {
  return (dispatch)=>{
    httpClient.get(URLS.settings).then((response)=>{
      console.log("Settings: ", response.data)
      dispatch({type:ACTION.GET_SETTINGS, payload: response.data})
    });
  };
}

export const changeSettingsData = (settings_data) => {
  return {type:ACTION.SET_SETTINGS_DATA, payload: settings_data}
}

export const updateSettings = (settings) => {
  return (dispatch)=>{
    dispatch({type:ACTION.SETTINGS_LOADING});
    httpClient.post(URLS.settings, settings).then(()=>{
      dispatch({type:ACTION.UPDATE_SETTINGS, payload: settings})
    })
  }
}

export const cancelSettings = () => {
  return {type:ACTION.SETTINGS_CANCEL}
}

export const getAdminData = () => {
  console.log('In get admin data')
  return (dispatch)=>{
    dispatch({type:ACTION.ADMIN_LOADING})
    httpClient.get(URLS.admin).then((response)=>{
      orders = response.data
      revenue = 0
      amount_quantity = {}
      orders.map((order)=>{
        revenue+=order.cart_price
        order.cart.map((cart_item)=>{
          if (amount_quantity[`${cart_item.amount} of ${cart_item.name}`]){
            amount_quantity[`${cart_item.amount} of ${cart_item.name}`]+=cart_item.quantity
          }
          else{
            amount_quantity[`${cart_item.amount} of ${cart_item.name}`] = cart_item.quantity
          }
        })
      });

      dispatch({type:ACTION.ADMIN_GET_DATA, payload:{orders, revenue, amount_quantity}})
    })
  }
}

export const markDelivered = (order_id) => {
  return (dispatch)=>{
    dispatch({type:ACTION.ADMIN_LOADING});
    httpClient.post(URLS.delivered, {order_id}).then(()=>{
      httpClient.get(URLS.admin).then((response)=>{
        orders = response.data
        revenue = 0
        amount_quantity = {}
        orders.map((order)=>{
          revenue+=order.cart_price
          order.cart.map((cart_item)=>{
            if (amount_quantity[`${cart_item.amount} of ${cart_item.name}`]){
              amount_quantity[`${cart_item.amount} of ${cart_item.name}`]+=cart_item.quantity
            }
            else{
              amount_quantity[`${cart_item.amount} of ${cart_item.name}`] = cart_item.quantity
            }
          })
        });
  
        dispatch({type:ACTION.ADMIN_GET_DATA, payload:{orders, revenue, amount_quantity}})
      })
    })
  }
}