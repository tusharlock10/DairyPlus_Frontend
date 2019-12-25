import { combineReducers } from 'redux';
import HomeReducer from './Home/reducer';
import LoginReducer from './Login/reducer';
import CartReducer from './Cart/reducer';
import OrderReducer from './Order/reducer';

export default combineReducers({
  login: LoginReducer,
  home: HomeReducer,
  cart: CartReducer,
  order: OrderReducer,
});
