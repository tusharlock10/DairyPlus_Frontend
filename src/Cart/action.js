import {ACTION} from '../types';
import {URLS, HTTP_TIMEOUT, BASE_URL} from '../Constants';
import axios from 'axios';
// import console = require('console');

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

export const calculate_grand_total = (cart, products_obj) => {
  let grand_total = 0;

  Object.keys(cart).map(product_id => {
    types = cart[product_id];
    Object.keys(types).map(amount => {
      quantity = types[amount];
      product = products_obj[product_id];
      product_types = product.product_types;

      product_types.map(type => {
        if (amount === type.amount) {
          grand_total += type.selling_price * quantity;
        }
      });
    });
  });
  return grand_total;
};

export const saveGrandTotal = grand_total => {
  return {type: ACTION.CART_SAVE_GRAND_TOTAL, payload: grand_total};
};

export const sendCartToServer = (cart, products_obj, grand_total) => {
  /*
    {product_id: {amount:quantity}} to [{product_id, name, amount, sub_total, quantity, selling_price}]
  */
  return (dispatch) => {
    let new_cart = [];

    Object.keys(cart).map(product_id => {
      types = cart[product_id];
      Object.keys(types).map(amount => {
        quantity = types[amount];
        product = products_obj[product_id];
        product_types = product.product_types;
        let new_object = {};

        selling_price = 0
        product_types.map(type => {
          if (amount === type.amount) {
            sub_total = type.selling_price * quantity;
            selling_price=type.selling_price
          }
        });

        new_object = {
          product_id,
          name: product.name,
          amount,
          sub_total,
          quantity,
          selling_price
        };
        new_cart.push(new_object);
      });
    });

    httpClient.post(URLS.savecart, {cart: new_cart, grand_total}).then((response)=>{
      dispatch({type:ACTION.CART_SET_ADDRESS, payload:response.data.address})
    })
  }
};

export const toggleFastDelivery = (value) => {
  return {type:ACTION.TOGGLE_FAST_DELIVERY}
}

export const placeOrder = (mode, fast_delivery, isPaid) => {
  if (isPaid==='paid'){
    return {type:ACTION.CART_MODIFY_PRODUCT, 
      payload:{mode:'reset',
      authtoken: httpClient.defaults.headers.common['Authorization']}
    }
  }
  return (dispatch)=>{
    dispatch({type: ACTION.CART_PLACE_ORDER_LOADING});
    httpClient.post(URLS.payment_offline, {mode, fast_delivery}).then((response)=>{
      if (response.data.successful){
        // Actions.replace('home')
        dispatch(
          {type:ACTION.CART_MODIFY_PRODUCT, 
            payload:{mode:'reset',
            authtoken: httpClient.defaults.headers.common['Authorization']}
          }
        )
      }
    })
  }
}

export const changePromoCode = (promo_code) => {
  return {type:ACTION.CART_CHANGE_PROMO_CODE, payload:promo_code}
}

export const getPromoCode = () => {
  return (dispatch)=>{
    dispatch({type:ACTION.CART_PROMO_CODE_LOADING})
    httpClient.get(URLS.promo_code).then((response)=>{
      dispatch({type:ACTION.CART_GET_PROMO_CODE, payload: response.data})
    })
  }
}

export const applyPromoCode = (promo_code) => {
  return (dispatch)=>{
    dispatch({type:ACTION.CART_PROMO_CODE_LOADING})
    httpClient.post(URLS.promo_code, {promo_code}).then((response)=>{
      console.log('Promo code response: ', response.data);
      if (response.data.error){
        dispatch({type:ACTION.CART_PROMO_CODE_ERROR, payload:response.data.error})
      }
      else{
        dispatch({type:ACTION.CART_PROMO_CODE_SUCCESS, payload:response.data.discount})
      }
    })
  }
}