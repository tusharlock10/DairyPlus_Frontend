export const ACTION = {
  // LOGIN
  REGISTER: 'login.register',
  LOGIN: 'login.login',
  LOGIN_LOADING: 'login.login_loading',
  LOGIN_OTP_LOADING: 'login.otp_loading',
  LOGIN_ERROR: 'login.error',
  SET_TOKEN: 'login.set_token',
  LOGIN_CLEAR_ERROR: 'login.clear_error',
  LOGIN_ISOTPSENT: 'login.is_otp_sent',

  // HOME
  HOME_GET_PRODUCTS: 'home.get_products',
  CHANGE_TAB: 'home.change_tab',
  SETTINGS_TOGGLE_THEME: 'home.settings.toggle_theme',
  GET_SETTINGS: "home.settings.get_settings",
  SET_SETTINGS_DATA: "home.settings.set_settings",
  SET_THEME: 'home.settings.theme',
  UPDATE_SETTINGS: "home.settings.update",
  SETTINGS_CANCEL: "home.settings.cancel",
  SETTINGS_LOADING: "home.settings.loading",
  ADMIN_GET_DATA: "home.admin.get_data",
  ADMIN_LOADING: "home.admin.loading",

  // CART
  CART_MODIFY_PRODUCT: 'cart.modify_product',
  CART_CALCULATE_GRAND_TOTAL: 'cart.calculate_grand_total',
  SET_CART: 'cart.set_cart',
  CART_SAVE_GRAND_TOTAL: 'cart.save_grand_total',
  TOGGLE_FAST_DELIVERY: 'cart.fast_delivery',
  CART_SET_ADDRESS: 'cart.set_address',
  CART_PLACE_ORDER_LOADING: 'cart.palce_order_loading',
  CART_CHANGE_PROMO_CODE: 'cart.change_promo_code',
  CART_PROMO_CODE_ERROR: "cart.promo_code_error",
  CART_PROMO_CODE_LOADING: "cart.promo_code_loading",
  CART_PROMO_CODE_SUCCESS: "cart.promo_code_success",
  CART_GET_PROMO_CODE: "cart.promo_code_get",

  // ORDER
  GET_INCOMPLETE_ORDERS: 'order.get_incomplete_orders',
  ORDER_CHANGE_BTN_GROUP_INDEX: 'order.change_btn_group_index',
  GET_COMPLETED_ORDERS: 'orders.get_completed_orders',
  ORDERS_REFRESHING: 'orders.refreshing',
}