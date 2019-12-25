import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Modal, 
  Alert, Dimensions, ScrollView, BackHandler, ActivityIndicator} from 'react-native';
import {Switch} from 'react-native-switch';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import ShadowView from 'react-native-simple-shadow-view';
import {toggleFastDelivery, placeOrder} from './action';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {Actions} from 'react-native-router-flux';
import {FONTS, BASE_URL, URLS, COLORS_LIGHT} from '../Constants';
// import console = require('console');
// import console = require('console');

const width = Dimensions.get('window').width
const CARD_WIDTH = (width-60)/2

class Payment extends Component {
  state = {
    showModal: false,
    status: 'Pending',
    payment_mode: '',
    payment_function:()=>{}
  };
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', ()=>{
      changeNavigationBarColor(this.props.COLORS.LIGHT)
      if(!this.props.orderPlaced){
        Actions.pop();
      }
    })
  }

  renderHeader() {
    const {COLORS} = this.props;
    return (
      <ShadowView
        style={{
          paddingRight: 24,
          paddingLeft: 9,
          paddingVertical: 14,
          margin: 10,
          shadowColor: COLORS.SHADOW_ALT,
          shadowOpacity: 0.25,
          shadowRadius: 15,
          borderRadius: 10,
          shadowOffset: {width: 0, height: 20},
          backgroundColor: COLORS.LIGHT_HEADER,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {
          (this.props.orderPlaced)?
          (<View style={{width:10}}/>):(
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
                changeNavigationBarColor(this.props.COLORS.LIGHT)
              }}
              style={{
                height:34, width:40,justifyContent:'center', alignItems:'center',
                marginRight: 10,
              }}>
              <Icon size={24} color={COLORS.DARK} name="arrow-left" />
            </TouchableOpacity>
          )
        }
        <Text
          style={{
            fontFamily: FONTS.RALEWAY_LIGHT,
            color: COLORS.DARK,
            fontSize: 34,
          }}>
          {(this.props.orderPlaced)?'Payment Done':'Payment'}
        </Text>
      </ShadowView>
    );
  }

  handleResponse = data => {
    if (data.title === 'success') {
      this.setState({showModal: false, status: 'Complete'});
      Alert.alert("Payment was successful", "Your order is placed, you can now see it in upcoming orders")
      this.props.placeOrder('Paypal',false,'paid' )
    } else if (data.title === 'cancel') {
      this.setState({showModal: false, status: 'Cancelled'});
      Alert.alert("Payment was cancelled")
    } else {
      return;
    }
  };

  renderPaypalWebView(){
    let p = Number(this.props.fast_delivery)
    return (
      <View style={{marginTop: 100}}>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.setState({showModal: false})}>
          <WebView
            source={{
              uri: BASE_URL+URLS.payment_paypal+`?fast=${p}`, 
              headers:{'Authorization':this.props.authtoken
            }}}
            onNavigationStateChange={data => this.handleResponse(data)}
            // injectedJavaScript={`document.f1.submit()`}
          />
        </Modal>
      </View>
    );
  }

  renderPaymentOptions() {
    const {COLORS} = this.props;
    return (
      <View style={{flex: 1, justifyContent: 'flex-start', marginTop:20, padding:10}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={{fontFamily:FONTS.PRODUCT_SANS,color:COLORS.DARK, fontSize:28, margin:10}}>
            Payment methods
          </Text>
          {
            (this.props.fast_delivery)?
            (
              <View style={{padding:10, borderColor:COLORS.DARK, borderWidth:0.6,elevation:7, borderRadius:30, backgroundColor:COLORS.LIGHT_HEADER}}>
                <Image source={require('../../assets/flash.png')} style={{height:22, width:22}} blurRadius={0.2}/>
              </View>
            ):<View/>
          }
        </View>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>{
            this.setState({
              payment_function:()=>{this.setState({showModal:true})}, payment_mode:"Pay with Paypal"
            }
          )}
        }>
          <ShadowView
            style={{
              margin: 10,justifyContent:'space-around', alignItems:'center',
              height:CARD_WIDTH,width:CARD_WIDTH,shadowOffset: { width: 0, height:10 },
              shadowColor: COLORS.SHADOW_PAYPAL,
              shadowOpacity: (COLORS.THEME==='light')?0.2:0.4,
              shadowRadius: (COLORS.THEME==='light')?7:10,
              padding: 10,
              borderRadius: 12,
              elevation: 7,
              backgroundColor: COLORS.LIGHT_HEADER,
            }}>
              <Text style={{fontFamily:FONTS.RALEWAY, fontSize:16, color:COLORS.DARK}}>Pay with PayPal</Text>
              <Image style={{height:60, width:60}} source={require('../../assets/paypal.png')} blurRadius={0.1}/>
              <Text style={{fontFamily:FONTS.RALEWAY, fontSize:11, color:COLORS.LESSER_DARK, 
                marginHorizontal:15, textAlign:'center'}}>
                Use your paypal account to pay online
              </Text>
            </ShadowView>
        </TouchableOpacity>

          <TouchableOpacity onPress={()=>{
            this.setState({
              payment_mode:'Cash on Delivery',
              payment_function:()=>{this.props.placeOrder('Cash', this.props.fast_delivery)}
              })
          }}>
            <ShadowView
              style={{
                margin: 10,justifyContent:'space-around', alignItems:'center',
                height:CARD_WIDTH,width:CARD_WIDTH,
                shadowColor: COLORS.SHADOW_CASH,
                shadowOffset: { width: 0, height:10 },
                shadowOpacity: (COLORS.THEME==='light')?0.2:0.4,
                shadowRadius:(COLORS.THEME==='light')?7:10,
                padding: 10,
                borderRadius: 12,
                elevation: 7,
                backgroundColor: COLORS.LIGHT_HEADER,
              }}>
                <Text style={{fontFamily:FONTS.RALEWAY, fontSize:16, color:COLORS.DARK}}>Cash on Delivery</Text>
                <Image style={{height:60, width:60}} source={require('../../assets/notes.png')} blurRadius={0.1}/>
                <Text style={{fontFamily:FONTS.RALEWAY, fontSize:11, color:COLORS.LESSER_DARK, 
                  marginHorizontal:15, textAlign:'center'}}>
                  Pay cash at the time of delivery
                </Text>
            </ShadowView>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{
            this.setState({
              payment_mode:'Cheque on Delivery',
              payment_function:()=>{this.props.placeOrder('Cheque', this.props.fast_delivery)}
            })
          }}>
              <ShadowView
                style={{
                  margin: 10,justifyContent:'space-around', alignItems:'center',
                  height:CARD_WIDTH,width:CARD_WIDTH,
                  shadowColor: COLORS.SHADOW_CHEQUE,shadowOffset: { width: 0, height:10 },
                  shadowOpacity: (COLORS.THEME==='light')?0.2:0.4,
                  shadowRadius: (COLORS.THEME==='light')?7:10,
                  padding: 10,
                  borderRadius: 12,
                  elevation: 7,
                  backgroundColor: COLORS.LIGHT_HEADER,
                }}>
                  <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.DARK}}>Cheque on Delivery</Text>
                  <Image style={{height:70, width:70}} source={require('../../assets/cheque.png')} blurRadius={0.1}/>
                  <Text style={{fontFamily:FONTS.RALEWAY, fontSize:11, color:COLORS.LESSER_DARK, 
                    marginHorizontal:15, textAlign:'center'}}>
                    Write a cheque at the time of delivery
                  </Text>
              </ShadowView>
            </TouchableOpacity>
            <View
              style={{
                margin: 10,justifyContent:'space-around', alignItems:'center',
                height:CARD_WIDTH,width:CARD_WIDTH,
                padding: 10,borderWidth:3, borderColor:COLORS.GRAY,
                borderRadius: 15,
                backgroundColor: COLORS.LIGHT_HEADER,
              }}>
                <Text style={{fontFamily:FONTS.RALEWAY, fontSize:16, color:COLORS.DARK}}>Fast Delivery</Text>
                <Switch
                  value = {this.props.fast_delivery}
                  onValueChange = {()=>{this.props.toggleFastDelivery()}}
                  backgroundActive={COLORS.GREEN}
                  backgroundInactive={'gray'}
                  circleSize={26}
                  barHeight={32}
                  changeValueImmediately={true}
                  outerCircleStyle={{elevation:7}}
                  innerCircleStyle={{elevation:15}}
                  switchLeftPx={3}
                  switchRightPx={3}
                  circleBorderWidth={0}
                  circleActiveColor={COLORS_LIGHT.LIGHT}
                  circleInActiveColor={COLORS_LIGHT.LIGHT}
                />
                <Text style={{fontFamily:FONTS.RALEWAY, fontSize:11, color:COLORS.LESSER_DARK, 
                  marginHorizontal:15, textAlign:'center'}}>
                  Prioritizes your delivery over others
                </Text>
              </View>
        </View>
      </View>
    );
  }

  renderPlaceOrder(){
    const {COLORS} = this.props;
    if (this.state.payment_mode){
      return (
      <ShadowView style={{position:'absolute', bottom:0,
        shadowColor: COLORS.SHADOW_CHEQUE,shadowOffset: { width: 0, height:-5 },
        shadowOpacity: (COLORS.THEME==='light')?0.2:0.4,
        shadowRadius: (COLORS.THEME==='light')?7:10,
        backgroundColor:(this.props.orderPlaced)?COLORS.LIGHT_BLUE:COLORS.GREEN, height:60, width:"100%"}}>
        {
          (this.props.orderPlaced)?
          (
            <View style={{flex:1, alignItems:'center', justifyContent:'space-around', flexDirection:'row'}}>
              {changeNavigationBarColor(COLORS.LIGHT_BLUE)}
              <Text style={{fontFamily:FONTS.RALEWAY, color:COLORS_LIGHT.LIGHT, fontSize:16}}> 
                See this order on Order Screen
              </Text>
              <TouchableOpacity onPress={()=>{
                  Actions.pop();
                  changeNavigationBarColor(COLORS.LIGHT)}}
                style={{backgroundColor:COLORS.LIGHT, borderRadius:10, height: 45, width:120,
                elevation:4, justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, color:COLORS.DARK, fontSize:15}}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          ):
          (
            <View style={{flex:1, alignItems:'center', justifyContent:'space-around', flexDirection:'row'}}>
              {changeNavigationBarColor(COLORS.GREEN)}
              <View>
                <Text style={{fontFamily:FONTS.RALEWAY, color:COLORS_LIGHT.LIGHT, fontSize:20}}> 
                  {this.state.payment_mode}
                </Text>
                {
                  (this.props.fast_delivery)?(
                    <Text style={{color:COLORS_LIGHT.LIGHT, fontFamily:FONTS.RALEWAY_BOLD, fontSize:12}}>
                      $ 25 for Fast Delivery</Text>
                  ):<View/>
                }
              </View>
              <TouchableOpacity onPress={()=>{
                if (!this.props.place_order_loading){
                  this.state.payment_function();
                }
                }}
                style={{backgroundColor:COLORS.LIGHT, borderRadius:10,height: 45, width:120,
                elevation:4, justifyContent:'center', alignItems:'center'}}>
                {
                  (!this.props.place_order_loading)?(
                    <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, color:COLORS.DARK, fontSize:15}}>
                      Place Order
                    </Text>
                  ):(
                    <ActivityIndicator size='large' color={COLORS.DARK} />
                  )
                }
              </TouchableOpacity>
            </View>
          )
        }

      </ShadowView> )  
    }
    else{
      return <View/>
    }
  }

  renderMainView(){
    const {COLORS} = this.props
    let grand_total = this.props.grand_total
    discounted_total = grand_total - (grand_total*this.props.discount)/100
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row', justifyContent:'flex-start', marginHorizontal:20,marginTop:10, alignItems:'flex-end'}}>
          <Text style={{fontFamily:FONTS.RALEWAY_BOLD,textDecorationLine:'underline', fontSize:26, color:COLORS.GREEN}}>To Pay</Text>
          <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:28, marginHorizontal:10,color:COLORS.DARK}}>
            $ {discounted_total}.<Text style={{fontSize:24}}>00</Text>
          </Text>
        </View>
        {this.renderPaymentOptions()}
        <Text style={{fontFamily:FONTS.PRODUCT_SANS, color:COLORS.LESSER_DARK, fontSize:12, marginLeft:20}}>
          Estimated Delivery Time {(this.props.fast_delivery)?' 1-2 days ':' 3-4 days '}</Text>
        <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20, flexWrap:'wrap'}}>
          <Text style={{fontFamily:FONTS.PRODUCT_SANS, color:COLORS.LESSER_DARK, fontSize:14}}>
            {'Delivery Address : '}</Text>
          <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, color:COLORS.LESSER_DARK, fontSize:13, flexWrap:'wrap'}}>
            {this.props.address}</Text>
        </View>
        <View style={{height:100}}/>
        {this.renderPaypalWebView()}
      </ScrollView>
    )
  }

  renderOrderPlaced(){
    const {COLORS} = this.props;
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', marginBottom:60}}>
        <Image source={require('../../assets/order_placed.png')} style={{height:200, width:200}}/>
        <Text style={{marginTop:20,fontFamily:FONTS.GOTHAM_BLACK, 
          color:COLORS.DARK, fontSize:14, marginHorizontal:50, textAlign:'center'}}>
          ORDER SUCCESSFULLY PLACED
        </Text>
      </View>
    )
  }

  render() {
    const {COLORS} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLORS.LIGHT}}>
        {this.renderHeader()}
        {
          (this.props.orderPlaced)?
          this.renderOrderPlaced():
          this.renderMainView()
        }
        {this.renderPlaceOrder()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    cart: state.cart.cart,
    COLORS: state.home.COLORS,
    grand_total: state.cart.grand_total,
    fast_delivery: state.cart.fast_delivery,
    authtoken: state.login.authtoken,
    address: state.cart.address,
    orderPlaced: state.cart.orderPlaced,
    place_order_loading: state.cart.place_order_loading,
    discount: state.cart.discount
  };
};

export default connect(mapStateToProps, {toggleFastDelivery, placeOrder})(Payment);
