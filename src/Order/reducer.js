import {ACTION} from '../types';

const INITIAL_STATE = {
  fetch_incomplete_orders: true,
  fetch_completed_orders:true,
  completed_orders:[],
  incomplete_orders: [],
  buttonGroupIndex: 0,
  loading: true,
  refreshing: false
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type){

    case ACTION.GET_INCOMPLETE_ORDERS:
      return {...state, incomplete_orders: action.payload, refreshing:false,
        fetch_incomplete_orders:false, loading: false}

    case ACTION.ORDER_CHANGE_BTN_GROUP_INDEX:
      return {...state, buttonGroupIndex: action.payload }

    case ACTION.GET_COMPLETED_ORDERS:
      return {...state, fetch_completed_orders:false, loading:false, refreshing:false,
        completed_orders:action.payload.orders, buttonGroupIndex: action.payload.index}

    case ACTION.ORDERS_REFRESHING:
      return {...state, loading:true, refreshing: true}

    default:
      return state
  }
}