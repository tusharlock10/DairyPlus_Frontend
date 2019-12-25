import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StatusBar, ScrollView, TextInput, Image, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import BottomTab from '../Components/BottomTab';
import ShadowView from 'react-native-simple-shadow-view';
import {FONTS, COLORS_LIGHT} from '../Constants';
import Icon from 'react-native-vector-icons/Feather';
import {modifyProductInCart} from "../Home/action";
import {calculate_grand_total, saveGrandTotal, sendCartToServer, setAuthToken,
  changePromoCode, applyPromoCode, getPromoCode} from './action';
import { Actions } from 'react-native-router-flux';



const nFormatter = (num, digits) => {
  if (!Number(num)){
    return "N/A"
  }
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

class Cart extends Component{

  componentDidMount(){
    this.props.setAuthToken()
    if (this.props.promo_code_loading){
      this.props.getPromoCode()
    }
  }

  renderHeader(){
    const {COLORS} = this.props
    return(
      <ShadowView style={{
        paddingHorizontal:24,
        paddingVertical:14,
        margin:10,
        shadowColor: COLORS.SHADOW_ALT,
        shadowOpacity: 0.25,
        shadowRadius: 15,
        borderRadius:10,
        shadowOffset: { width: 0, height:20 },
        backgroundColor: COLORS.LIGHT_HEADER,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
      }}>
        <Text style={{fontFamily:FONTS.RALEWAY_LIGHT, color:COLORS.DARK, fontSize:34}}>
          Cart
        </Text>
      </ShadowView>
    );
  }

  renderProductCard(item){
    const {COLORS} = this.props
    return (
      <ShadowView style={{
        margin:15,
        height:CARD_WIDTH, width:CARD_WIDTH,
        shadowColor: COLORS.SHADOW,
        shadowOpacity: 0.25,
        shadowRadius: 12,

        borderRadius:15,
        shadowOffset: { width: 0, height:8 },
        backgroundColor: COLORS.LIGHT_HEADER,
      }}>
        <Image
          style={{flex:3, width:CARD_WIDTH, borderTopLeftRadius:10, borderTopRightRadius:10}}
          source={{uri:item.image}}
        />
        <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
          <Text style={{fontSize:13, fontFamily:FONTS.RALEWAY, color:COLORS.DARK}}>
            {item.name}
          </Text>
        </View>
      </ShadowView>
    )
  }

  renderType(product_id, name, type){
    const {COLORS} = this.props;
    let error = ""
    const sub_total = nFormatter(type.selling_price*this.props.cart[product_id][type.amount],3);

    if (this.props.cart[product_id][type.amount] && this.props.cart[product_id][type.amount].toString().length===0){
      error = "Quantity cannot be empty"
    }
    else if (sub_total === "N/A"){
      error = "Quantity can only have numbers"
    }
    else if (Number(sub_total)<1){
      error = "Quantity cannot be smaller than 1"
    }
    else if (Number(this.props.cart[product_id][type.amount])>10000){
      error = "You cannot order more than 10000 of these at once"
    }
    
    if (!this.props.cart[product_id].hasOwnProperty(type.amount)){
      return <View/>;
    }

    return (
      <ShadowView style={{flex:1, marginVertical:10, marginHorizontal:10,
        borderRadius:15, padding:5, backgroundColor:COLORS.LIGHT_HEADER, shadowColor: COLORS.SHADOW_ALT,
        shadowOpacity: 0.4 ,shadowRadius: 6,
        borderRadius:10,shadowOffset: { width:0, height:10 }}}
        >
        <Text style={{fontFamily:FONTS.RALEWAY, fontSize:18,marginLeft:10, marginTop:5, color:COLORS.DARK}}>
          {type.amount} of {name}
        </Text>
        <View style={{flex:1, flexDirection:'row', marginLeft:10}}>
          <View style={{flex:3}}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
              <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:24, color:COLORS.DARK}}>
                $ {type.selling_price}
              </Text>
            </View>
            <Text style={{fontSize:12, marginLeft:20, fontFamily:FONTS.RALEWAY, color:COLORS.GRAY, marginTop:3}}>
              In stock: {type.available_stock}
            </Text>
            
          </View>
          <TouchableOpacity onPress={()=>{
              this.props.modifyProductInCart('remove',product_id, type.amount, type.selling_price)
            }}>
            <ShadowView style={{margin:10, height:40, width:120, 
              justifyContent:'space-around', alignItems:'center',
              elevation:7, backgroundColor:COLORS.RED, 
              flexDirection:'row', paddingHorizontal:10,
              shadowColor: COLORS.SHADOW_ALT,
              shadowOpacity: 0.6 ,shadowRadius: 5,
              borderRadius:7.5,shadowOffset: { width:3, height:3 }}}>
              <Text style={{fontFamily:FONTS.PRODUCT_SANS, fontSize:18, color:COLORS_LIGHT.LIGHT}}>
                Remove
              </Text>
              <Icon name={"x-circle"} size={20} color={COLORS_LIGHT.LIGHT} />
            </ShadowView>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginHorizontal:10}}>
          <View style={{marginVertical:5, alignSelf:'flex-start', height:35,
            flexDirection:'row', alignItems:'flex-end', paddingBottom:5 ,borderRadius:5, borderBottomWidth:1, borderColor:COLORS.GRAY}}>
            <Text style={{fontSize:14,marginHorizontal:5, fontFamily:FONTS.RALEWAY, color:COLORS.DARK}}>
              Quantity
            </Text>
            <TextInput 
              style={{fontFamily:FONTS.EXPRESSWAY, fontSize:14,textAlign:'center',textAlignVertical:'bottom',
                color:COLORS.DARK, width:50, height:35, padding:0, margin:0, marginBottom:2 }}
              keyboardType="number-pad"
              value={this.props.cart[product_id][type.amount].toString()}
              onChangeText={(text)=>{
                this.props.modifyProductInCart('add',product_id, type.amount, type.selling_price, text)
              }}
            />
          </View>
          <View style={{borderRadius:5, borderWidth:1, borderColor:COLORS.GRAY, height:50, width:120,padding:10, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontFamily:FONTS.HELVETICA_NEUE, color:COLORS.GRAY, fontSize:10}}>Sub Total</Text>
            <Text style={{fontFamily:FONTS.EXPRESSWAY, color:COLORS.DARK, fontSize:17, marginRight:7}}>
              $ {
                (this.props.cart[product_id][type.amount].toString().length===0)?
                "N/A":
                sub_total
              }
            </Text>
          </View>
        </View>
        {
          (error)?
            <Text style={{fontFamily:FONTS.PRODUCT_SANS, fontSize:12, color:COLORS.RED, marginHorizontal:10, marginVertical:5}}>
              {error}
            </Text>
          :<View/>
          }

      </ShadowView>
    )
  }

  renderTypeHelper(product_id,obj){
    return (
      obj.product_types.map((item)=>{
        return this.renderType(product_id, obj.name, item)
      })
    )
  }

  renderCart(){
    return (
      Object.keys(this.props.cart).map((item)=>{
        return (
          (
            <View>
              {this.renderTypeHelper(item, this.props.products_obj[item])}
            </View>
          )
        )
      })
    )
  }

  renderTotal(){
    const {COLORS} = this.props;
    let grand_total = calculate_grand_total(this.props.cart, this.props.products_obj)
    let discounted_total = grand_total - (this.props.discount*grand_total)/100
    return (
      <View style={{width:"100%", padding:5, flexDirection:'row', 
        alignItems:'center', justifyContent:'center', borderBottomWidth:1}}>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:COLORS.DARK, fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:14}}>
            Total
          </Text>
          <Text style={{color:COLORS.DARK, fontFamily:FONTS.EXPRESSWAY, fontSize:20, marginRight:2}}>
            $ {discounted_total}
          </Text>
          {
            (this.props.promo_code_applied)?(
              <Text style={{color:COLORS.DARK_GRAY, fontFamily:FONTS.EXPRESSWAY, fontSize:10}}>
                Earlier - $ {grand_total}
              </Text>
            ):<View/>
          }
          <View style={{borderColor:COLORS.DARK,width:140, borderBottomWidth:1, justifyContent:'center', alignItems:'center', margin:10}}>
            <TextInput
              placeholder="Promo Code Here"
              placeholderTextColor={COLORS.DARK_GRAY}
              style={{fontFamily:FONTS.PRODUCT_SANS, fontSize:13,textAlignVertical:'bottom',
                  color:COLORS.DARK,width:120 , height:28, padding:2, margin:0, marginBottom:5 }}
              maxLength={16}
              value = {this.props.promo_code}
              editable = {!this.props.promo_code_applied}
              onChangeText = {(promo_code)=>{this.props.changePromoCode(promo_code)}}
            />
            
          </View>
          {
            (this.props.promo_code_applied)?(
              <Text style={{fontFamily:FONTS.PRODUCT_SANS, color:COLORS.GREEN, fontSize:12}}>
                Code Applied - {this.props.discount}% OFF
              </Text>
            ):(
              <Text style={{fontFamily:FONTS.PRODUCT_SANS, color:COLORS.RED, fontSize:12}}>
                {this.props.promo_code_error}
              </Text>
            )
          }
        </View>

        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity onPress={()=>{
            grand_total = calculate_grand_total(this.props.cart, this.props.products_obj)
            this.props.saveGrandTotal(grand_total);
            this.props.sendCartToServer(this.props.cart, this.props.products_obj, grand_total)
            Actions.jump('payment');
          }}>
            <ShadowView style={{
              height:50,width:120,
              margin:10,
              shadowColor: COLORS.PAY_BTN_SHADOW,
              shadowOpacity: 0.30,
              shadowRadius: 8,
              borderRadius:12,
              shadowOffset: { width: 0, height:10 },
              backgroundColor: COLORS.PAY_BTN_BACK,
              alignItems:'center',
              justifyContent:'center'
            }}>
              <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, color:COLORS.PAY_BTN_TEXT, fontSize:16}}>
                Payment
              </Text>
            </ShadowView>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            if (this.props.promo_code_applied){
              this.props.applyPromoCode("##REMOVE##")
            }
            else{
              this.props.applyPromoCode(this.props.promo_code)
            }
          }}>
            <ShadowView style={{
              height:50,width:120,
              margin:10,
              shadowColor: COLORS.SHADOW_ALT,
              shadowOpacity: 0.30,
              shadowRadius: 8,
              borderRadius:12,
              shadowOffset: { width: 0, height:10 },
              backgroundColor: (this.props.promo_code_applied)?COLORS.RED:COLORS.GREEN,
              alignItems:'center',
              justifyContent:'center'
            }}>
              {
                (this.props.promo_code_applied)?(
                  (this.props.promo_code_loading)?(
                    <ActivityIndicator color={COLORS_LIGHT.LIGHT} size="large" />
                  ):(
                  <Text style={{fontFamily:FONTS.PRODUCT_SANS, color:COLORS_LIGHT.LIGHT, fontSize:15}}>
                    Remove Code
                  </Text>
                  )
                ):(
                  (this.props.promo_code_loading)?(
                    <ActivityIndicator color={COLORS_LIGHT.LIGHT} size="large" />
                  ):(
                  <Text style={{fontFamily:FONTS.PRODUCT_SANS, color:COLORS_LIGHT.LIGHT, fontSize:15}}>
                    Apply Code
                  </Text>
                  )
                )
              }
            </ShadowView>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderCartBelow(){
    return (
      <View style={{flex:1}}>
        {this.renderTotal()}
        <ScrollView contentContainerStyle={{padding:10}}>
          {this.renderCart()}
          <View style={{height:120}}/>
        </ScrollView>
      </View>
    )
  }

  render(){
    const {COLORS} = this.props;
    return(
      <View style={{flex:1, backgroundColor:COLORS.LIGHT}}>
        <StatusBar
          barStyle={COLORS.BAR_STYLE}
          backgroundColor={COLORS.LIGHT}
        />
        {this.renderHeader()}
        {
          (Object.keys(this.props.cart).length===0)?
          (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Image
              style={{height:200, width:200}}
              source={require("../../assets/empty_cart.png")}
            />
            <Text style={{color:COLORS.DARK, fontFamily:FONTS.GOTHAM_BLACK, fontSize:24, marginTop:20}}>CART EMPTY</Text>
          </View>):
          this.renderCartBelow()
        }
        
        <BottomTab colors={COLORS}/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
    COLORS: state.home.COLORS,
    cart:state.cart.cart,
    grand_total:state.cart.grand_total,
    products: state.home.products,
    products_obj: state.home.products_obj,
    promo_code: state.cart.promo_code,
    discount:state.cart.discount,
    promo_code_loading: state.cart.promo_code_loading,
    promo_code_applied: state.cart.promo_code_applied,
    promo_code_error: state.cart.promo_code_error
  }
}

export default connect(mapStateToProps, {
  saveGrandTotal, sendCartToServer, setAuthToken, modifyProductInCart, 
  changePromoCode, applyPromoCode, getPromoCode})(Cart);