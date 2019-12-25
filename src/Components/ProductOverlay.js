import React, {Component} from 'react';
import {Text, View, TouchableOpacity,  FlatList, StatusBar, ScrollView, TextInput} from 'react-native';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import {modifyProductInCart} from '../Home/action';
import {Overlay} from 'react-native-elements';
import { FONTS, COLORS_LIGHT } from '../Constants';
import Icon from 'react-native-vector-icons/Feather';
import ShadowView from 'react-native-simple-shadow-view';
// import console = require('console');

const nFormatter = (num, digits) => {
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

class ProductOverlay extends Component{

  renderType(product_id, name, type){
    const {COLORS} = this.props;
    let isAdded = false
    if (this.props.cart[product_id]){
      if (this.props.cart[product_id].hasOwnProperty(type.amount)){
        isAdded = true;
      }
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
              {
                (isAdded)?(
                  <View style={{flexDirection:'row', marginLeft:8, alignItems:'center', marginTop:5}}>
                    <Icon name="check" size={12} color={COLORS.GREEN} />
                    <Text style={{color:COLORS.GREEN, fontFamily:FONTS.RALEWAY, fontSize:12, margin:3}}>
                      Added
                    </Text>
                  </View>
                ):(
                  <View/>
                )
              }
            </View>
            <Text style={{fontSize:12, marginLeft:20, fontFamily:FONTS.RALEWAY, color:COLORS.GRAY, marginTop:3}}>
              In stock: {type.available_stock}
            </Text>
            
          </View>
          <TouchableOpacity onPress={()=>{
            if (!isAdded){
              this.props.modifyProductInCart('add',product_id, type.amount, type.selling_price, 1)
            }
            else{
              this.props.modifyProductInCart('remove',product_id, type.amount, type.selling_price)
            }
            }}>
            <ShadowView style={{margin:10, height:40, width:120, 
              justifyContent:'space-around', alignItems:'center',
              elevation:7, backgroundColor:(isAdded)?COLORS.RED:COLORS.GREEN, 
              flexDirection:'row', paddingHorizontal:10,
              shadowColor: COLORS.SHADOW_ALT,
              shadowOpacity: 0.6 ,shadowRadius: 5,
              borderRadius:7.5,shadowOffset: { width:3, height:3 }}}>
              <Text style={{fontFamily:FONTS.PRODUCT_SANS, fontSize:18, color:COLORS_LIGHT.LIGHT}}>
                {(isAdded)?'Remove':'Add'}
              </Text>
              <Icon name={(isAdded)?"x-circle":"shopping-bag"} size={20} color={COLORS_LIGHT.LIGHT} />
            </ShadowView>
          </TouchableOpacity>
        </View>
        {
          (isAdded)?
          (
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
                    nFormatter(type.selling_price*this.props.cart[product_id][type.amount],3)
                  }
                </Text>
              </View>
            </View>
          ):<View/>
        }
      </ShadowView>
    )
  }

  render(){
    const {item, COLORS} = this.props;
    return (
      <Overlay
        isVisible={true}
        onBackdropPress={()=>{this.props.onRequestClose()}}
        width="90%" height="72.5%"
        overlayStyle={{borderRadius:30, paddingHorizontal:20,paddingVertical:0}}
        containerStyle={{padding:0}}
        overlayBackgroundColor={COLORS.LIGHT}
      >
        <View>
          <StatusBar
            barStyle={COLORS.OVERLAY_STATUS_BAR_STYLE}
            backgroundColor={COLORS.OVERLAY_STATUS_BAR_COLOR}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flexDirection:'row', marginTop:20}}>
              <View style={{elevation:7, backgroundColor:'white',borderRadius:20, overflow:'hidden'}}>
                <Image source={{uri:item.image}} style={{height:120,width:120}}/>
              </View>
              <View style={{flex:1, justifyContent:'center', padding:10, alignItems:'center'}}>
                <Text style={{color:COLORS.DARK, fontSize:26, fontFamily:FONTS.RALEWAY_BOLD, textAlign:'center'}}>
                  {item.name}
                </Text>
              </View>
            </View>

            <Text style={{marginVertical:20, fontFamily:FONTS.RALEWAY, 
              fontSize:18, color:COLORS.DARK, textAlign:'center'}}>
              {item.description}
            </Text>

              <FlatList
                data={item.product_types}
                renderItem={(type)=>{
                  return this.renderType(item._id,item.name, type.item)
                }}
                contentContainerStyle={{paddingVertical:20}}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
              />

            <View style={{height:120}}/>
          </ScrollView>
        </View>

      </Overlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart:state.cart.cart,
  }
}


export default connect(mapStateToProps,{modifyProductInCart})(ProductOverlay);