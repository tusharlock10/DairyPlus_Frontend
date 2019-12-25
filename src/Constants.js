// export const BASE_URL = "http://192.168.0.103:8000"
export const BASE_URL = "https://dairy-plus.herokuapp.com"

export const HTTP_TIMEOUT = 20000;

export const URLS = {
  login: '/api/login/',
  register: '/api/register/',

  getproducts: '/api/getproducts/',
  settings: '/api/settings/',
  admin: '/api/admin/',
  delivered: "/api/admin/delivered/",
  promo_code:"/api/cart/promocode/",

  savecart: '/api/savecart/',
  payment_paypal: '/api/payment/paypal/',
  payment_offline: "/api/payment/offline/",

  get_incomplete_orders: '/api/getincompleteorders/',
  get_completed_orders: '/api/getcompletedorders/',
}

export const FONTS = {
  PRODUCT_SANS: 'Product-Sans',
  PRODUCT_SANS_BOLD: 'Product-Sans-Bold',

  HELVETICA_NEUE: 'HelveticaNeue',

  ROBOTO_BOLD: 'Roboto-Bold',

  GOTHAM_BLACK: 'Gotham-Black',

  // LATO FONT
  LATO: 'Lato-Regular',
  LATO_BLACK: 'Lato-Black',
  LATO_BOLD: 'Lato-Bold',
  LATO_THIN: 'Lato-THIN',

  // RALEWAY FONT
  RALEWAY: 'Raleway-Regular',
  RALEWAY_BLACK: 'Raleway-Black',
  RALEWAY_BOLD: 'Raleway-Bold',
  RALEWAY_LIGHT: 'Raleway-Light',

  MATIZ_HEADING: 'Matiz',

  MERRIWEATHER: 'Merriweather',
  MERRIWEATHER_BOLD: 'Merriweather-Bold',
  MERRIWEATHER_LIGHT: 'Merriweather-Light',

  // OFFICIAL FONT
  LECKERLIONE: 'LeckerliOne-Regular',
  EXPRESSWAY:"Expressway"
}

export const COLORS_LIGHT = {
  THEME: 'light',
  LIGHT: "#FFFFFF",
  LIGHT_HEADER: "#FFFFFF",
  DARK: "#222b45",
  LESSER_LIGHT: "rgb(210,210,210)",
  LESSER_DARK: "#303d61",
  GRAY: "rgb(120,120,120)",
  DARK_GRAY: "#5e5e5e",
  SHADOW_ALT: "#9f9f9f",
  SHADOW:"#9f9f9f",
  OVERLAY_STATUS_BAR_COLOR:"rgb(152, 152, 152)",
  OVERLAY_STATUS_BAR_STYLE:"light-content", 
  BAR_STYLE: 'dark-content',
  RED: "#ED213A",
  GREEN: "#6abf62",
  LIGHT_BLUE: "#00b8f0",
  BOTTOM_TAB_COLOR: 'rgba(245,255,255 ,0.75)',
  PAY_BTN_BACK: "#fcfffc",
  PAY_BTN_TEXT: "#6abf62",
  PAY_BTN_SHADOW: "#6abf62",
  SHADOW_PAYPAL:"#222b45",
  SHADOW_CASH:"#222b45",
  SHADOW_CHEQUE:"#222b45"
}

export const COLORS_DARK = {
  THEME:'dark',
  LIGHT: "#222b45",
  LIGHT_HEADER: "#283351",
  DARK: "#FFFFFF",
  LESSER_LIGHT: "#303d61",
  LESSER_DARK: "rgb(210,210,210)",
  GRAY: "rgb(170,170,170)",
  DARK_GRAY: "#a0a0a0",
  SHADOW_ALT: "#000000",
  SHADOW: "#000000",
  OVERLAY_STATUS_BAR_COLOR:"rgb(20,26,41)",
  OVERLAY_STATUS_BAR_STYLE:"light-content", 
  BAR_STYLE: 'light-content',
  RED: "#ED213A",
  GREEN: "#6abf62",
  LIGHT_BLUE:'#00a4d6',
  BOTTOM_TAB_COLOR: 'rgba(50,60,80,0.75)',
  PAY_BTN_BACK: "#6abf62",
  PAY_BTN_TEXT: "#FFFFFF",
  PAY_BTN_SHADOW: "#000000",
  SHADOW_PAYPAL:"#000000",
  SHADOW_CASH:"#000000",
  SHADOW_CHEQUE:"#000000"
}
