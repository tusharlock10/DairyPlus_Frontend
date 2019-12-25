import {COLORS_LIGHT, COLORS_DARK} from '../Constants';
import {AsyncStorage} from 'react-native';
import { ACTION } from '../types';
// import console = require('console')
// import console = require('console');

const INITIAL_STATE = {
  COLORS: COLORS_LIGHT,
  loading: true,
  products: [],
  tab_name:'home',
  products_obj: {},
  settings:{name: ""},
  settings_backup: {name: ""},
  settings_loading: true,
  admin_orders: [],
  revenue: 0,
  amount_quantity: {},
  admin_loading:true
}

export default (state=INITIAL_STATE, action)=>{
  switch (action.type){
  
    case ACTION.HOME_GET_PRODUCTS:
      return {...state, products:action.payload.products, loading:false, products_obj:action.payload.products_obj}

    case ACTION.CHANGE_TAB:
      return {...state, tab_name:action.payload}

    case ACTION.SETTINGS_TOGGLE_THEME:
      if (state.COLORS.THEME==='light'){
        NEW_COLORS = COLORS_DARK
      }
      else{
        NEW_COLORS = COLORS_LIGHT
      }
      AsyncStorage.setItem('theme', NEW_COLORS.THEME)
      return {...state, COLORS: NEW_COLORS}

    case ACTION.GET_SETTINGS:
      return {...state, settings: action.payload, settings_backup:action.payload, settings_loading: false}

    case ACTION.SET_SETTINGS_DATA:
      return {...state, settings:{...action.payload}}

    case ACTION.SET_THEME:
        if (action.payload==='light'){
          NEW_COLORS = COLORS_LIGHT
        }
        else{
          NEW_COLORS = COLORS_DARK
        }
      return {...state, COLORS: NEW_COLORS }

    case ACTION.UPDATE_SETTINGS:
      return {...state, settings_backup: action.payload, settings_loading:false}

    case ACTION.SETTINGS_LOADING:
      return {...state, settings_loading: true}

    case ACTION.SETTINGS_CANCEL:
      return {...state, settings: state.settings_backup}

    case ACTION.ADMIN_LOADING:
      return {...state, admin_loading:true}

    case ACTION.ADMIN_GET_DATA:
      return {...state, admin_orders:action.payload.orders, 
        revenue:action.payload.revenue, 
        amount_quantity:action.payload.amount_quantity, admin_loading:false}

    default:
      return state
  }
}