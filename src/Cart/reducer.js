import {ACTION} from '../types';
import {AsyncStorage} from 'react-native';

const INITIAL_STATE = {
  cart: {}, // {product_id: {amount: quantity} }
  grand_total: 0,
  fast_delivery: false,
  address:"",
  orderPlaced: false,
  place_order_loading: false,
  promo_code: "",
  discount:0,
  promo_code_error: "",
  promo_code_loading:true,
  promo_code_applied: false
};

const saveCart = (authtoken, cart) => {
  AsyncStorage.removeItem(authtoken);
  AsyncStorage.setItem(authtoken, JSON.stringify(cart))
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION.CART_MODIFY_PRODUCT:
      state.orderPlaced = false;
      if (action.payload.mode==='add'){
        const {product_id, amount, quantity, authtoken} = action.payload;

        if (state.cart[product_id]) {
          state.cart[product_id][amount] = quantity;
        } else {
          let x = {};
          x[amount] = quantity;
          state.cart[product_id] = x;
        }
      }
      else if (action.payload.mode==='remove'){
        delete state.cart[action.payload.product_id][action.payload.amount];
        if (Object.keys(state.cart[action.payload.product_id]).length === 0) {
          delete state.cart[action.payload.product_id];
        }
      }

      else if (action.payload.mode==='reset'){
        state.grand_total=0;
        state.fast_delivery = false;
        state.orderPlaced = true
        state.cart = {};
      }

      saveCart(authtoken, state.cart);
      return {...state, cart: {...state.cart}, place_order_loading: false};

    case ACTION.CART_CALCULATE_GRAND_TOTAL:
      return {...state, grand_total: action.payload.grand_total};

    case ACTION.SET_CART:
      return {...state, cart: action.payload};

    case ACTION.CART_SAVE_GRAND_TOTAL:
      return {...state, grand_total: action.payload};

    case ACTION.TOGGLE_FAST_DELIVERY:
      new_fast_delivery = !state.fast_delivery
      if (new_fast_delivery){
        state.grand_total += 25
      }
      else{
        state.grand_total -= 25
      }
      return {...state, fast_delivery:new_fast_delivery, grand_total:state.grand_total}

    case ACTION.CART_SET_ADDRESS:
      return {...state, address: action.payload}

    case ACTION.CART_GET_PROMO_CODE:
      promo_code_applied = false
      if (action.payload.discount!==0){
        promo_code_applied = true
      }
      return {...state, promo_code: action.payload.promo_code , promo_code_applied, promo_code_error:"",
        discount:action.payload.discount, promo_code_loading:false}

    case ACTION.CART_PLACE_ORDER_LOADING:
      return {...state, place_order_loading:true}

    case ACTION.CART_CHANGE_PROMO_CODE:
      return {...state, promo_code: action.payload, promo_code_error:""}

    case ACTION.CART_PROMO_CODE_LOADING:
      return {...state, promo_code_loading: true}

    case ACTION.CART_PROMO_CODE_ERROR:
      let promo_code = state.promo_code
      if (action.payload==="Promo Code Removed"){
        action.payload = ""
        promo_code = ""
      }
      return {...state, promo_code_error:action.payload,discount:0, promo_code,
        promo_code_loading:false, promo_code_applied:false}

    case ACTION.CART_PROMO_CODE_SUCCESS:
      return {...state, promo_code_error:"", promo_code_loading:false,
        promo_code_applied:true, discount:action.payload}

    default:
      return state;
  }
};
