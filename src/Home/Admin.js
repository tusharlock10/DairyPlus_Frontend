import React, {Component} from 'react';
import {View, Image, TouchableOpacity,Text, ScrollView, Alert, ActivityIndicator, RefreshControl} from 'react-native';
import ShadowView from 'react-native-simple-shadow-view';
import {FONTS, COLORS_DARK} from '../Constants';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {Actions} from 'react-native-router-flux';
import {getAdminData, markDelivered} from './action';

const DELIVERED_MSG_PAYPAL = "Marking this order delivered will move it to the delivered \
orders tab. This operation cannot be undone."

const DELIVERED_MSG_OFFLINE = "Marking this order delivered will move it to the delivered \
orders tab. This operation cannot be undone. Make sure you have collected the payment in \
cash/cheque which ever option the user chose for this delivery."


class Admin extends Component {

  state={
    openedOrdersIndex: -1,
  }

  componentDidMount(){
    this.props.getAdminData()
  }

  renderHeader(){
    const {COLORS} = this.props;
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
        alignItems:'center',
        flexDirection:'row',
      }}>
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
            changeNavigationBarColor(COLORS.LIGHT);
          }}
          style={{
            height:34, width:40,justifyContent:'center', alignItems:'center',
            marginRight: 10,
          }}>
          <Icon size={24} color={COLORS.DARK} name="arrow-left" />
        </TouchableOpacity>
        <Text style={{fontFamily:FONTS.RALEWAY_LIGHT, color:COLORS.DARK, fontSize:34}}>
          Admin Panel
        </Text>
      </ShadowView>
    );
  }

  renderRevenue(){
    const {COLORS} = this.props;
    return (
      <View style={{margin:10, marginLeft:20}}>
        <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:24, color:COLORS.DARK}}>
          Revenue: {
            <Text style={{color:COLORS.GREEN}}>$ {this.props.revenue}</Text>
          }
        </Text>
      </View>
    )
  }

  renderCartItems(cart_items){
    const {COLORS} = this.props
    return(
      <View style={{paddingVertical:10, marginHorizontal:10, borderTopWidth:0.5, borderTopColor:COLORS.GRAY}}>
        {
          cart_items.map((cart_item)=>{
            return (
              <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                <Text style={{fontFamily:FONTS.MERRIWEATHER, fontSize:18, color:COLORS.DARK}}>
                  {cart_item.amount} of {cart_item.name}
                </Text>
                <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:20, color:COLORS.DARK,}}>
                  {cart_item.quantity.toString()} ($ {cart_item.sub_total.toString()})
                </Text>
              </View>
            )
          })
        }
      </View>
    )
  }

  renderUpcomingOrderItem(item, index){
    const {COLORS} = this.props;
    let expected_date_of_delivery = new Date(item.expected_date_of_delivery)
    expected_date_of_delivery = expected_date_of_delivery.toDateString().toUpperCase()
    let date_ordered = new Date(item.date_ordered)
    let time_ordered = date_ordered.toLocaleTimeString().toUpperCase();
    date_ordered = date_ordered.toDateString().toUpperCase();
    let number_of_items = 0;


    item.cart.map((cart_item)=>{
      number_of_items+=cart_item.quantity
    })

    return (
      <ShadowView style={{ paddingHorizontal:10, paddingVertical:5,
        margin:10,shadowColor: COLORS.SHADOW_ALT,
        shadowOpacity:(COLORS.THEME==='light')?0.35:0.55,
        shadowRadius:(COLORS.THEME==='light')?10:12, 
        borderRadius:14,shadowOffset: { width: 0, height:10 },
        backgroundColor: COLORS.LIGHT_HEADER,
        borderColor:COLORS.DARK
      }}>
        <View style={{paddingHorizontal:10,marginTop:5,justifyContent:'space-between', flexDirection:'row', alignItems:'center',borderBottomWidth:0.5, borderColor:COLORS.GRAY, paddingBottom:5, marginBottom:5}}>
          <View>
            <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:12, color:COLORS.GRAY}}>
              {'ORDER ID  | '} {item.show_order_id}
            </Text>
            <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:14, color:COLORS.GRAY}}>
              {date_ordered} {time_ordered}
            </Text>
          </View>

          {
            (item.isPaid)?(
              <View style={{alignItems:'center'}}>
                <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:18, color:COLORS.GREEN,}}>
                  $ {item.cart_price}
                </Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Icon name="check" size={10} color={COLORS.GREEN} />
                  <Text style={{color:COLORS.GREEN, fontFamily:FONTS.EXPRESSWAY, fontSize:10}}>
                    Paid
                  </Text>
                </View>
              </View>
            ):(
              <Text style={{ marginLeft:10, fontFamily:FONTS.EXPRESSWAY, fontSize:24, color:COLORS.RED, marginRight:10}}>
                $ {item.cart_price}
              </Text>
            )
          }
        </View>
        <View style={{justifyContent:'center', padding:10, borderBottomWidth:0.5, borderColor:COLORS.GRAY}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginRight:15}}>
            <View>
              <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
                Name
              </Text>
              <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,marginBottom:10}}>
                {item.user_name}
              </Text>
            </View>
            <View>
              <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
                Phone Number
              </Text>
              <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,marginBottom:10}}>
                {item.phone}
              </Text>
            </View>
          </View>



          {
            (item.discount!==0)?(
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginRight:15}}>
                <View>
                  <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
                    Promo Code
                  </Text>
                  <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,marginBottom:10}}>
                    {item.promo_code} {item.discount}%
                  </Text>
                </View>
                <View>
                  <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
                    Original Price
                  </Text>
                  <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:14, color:COLORS.GRAY,marginBottom:10}}>
                    $ {item.original_price}
                  </Text>
                </View>
              </View>
            ):<View/>
          }



          <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
            Delivery Address
          </Text>
          <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,marginBottom:10}}>
            {item.address}
          </Text>
        </View>
        <View style={{margin:10, marginBottom:5, justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
          <View>
            <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:12, color:COLORS.DARK}}>
              Expected Date of Delivery
            </Text>
            <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:18.5, color:COLORS.LIGHT_BLUE,}}>
              {expected_date_of_delivery}
            </Text>
          </View>
          {
            (item.fast_delivery)?
            (
              <View style={{padding:10, borderColor:COLORS.DARK, borderWidth:0.6,elevation:5, borderRadius:30, backgroundColor:COLORS.LIGHT}}>
                <Image source={require('../../assets/flash.png')} style={{height:18, width:18}} blurRadius={0.2}/>
              </View>
            ):<View/>
          }
        </View>
        <Text style={{marginLeft:10, fontFamily:FONTS.RALEWAY, fontSize:16, color:COLORS.DARK}}>
          Payment method : {item.payment_method}
        </Text>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginVertical:20, marginHorizontal:10}}>
          <Text style={{fontFamily:FONTS.RALEWAY_BOLD, 
            fontSize:18, color:COLORS.DARK}}>
            Total Items : {number_of_items}
          </Text>
          <TouchableOpacity onPress={()=>{
            if (this.state.openedOrdersIndex===index){
              this.setState({openedOrdersIndex:-1})
            }
            else{
              this.setState({openedOrdersIndex:index})
            }
          }}>
            <Text
              style={{fontFamily:FONTS.RALEWAY, textDecorationLine:'underline', fontSize:18, color:COLORS.LIGHT_BLUE}}>
              {(this.state.openedOrdersIndex===index)?'Hide Items':'Show Items'}
            </Text>
          </TouchableOpacity>
        </View>
        {(this.state.openedOrdersIndex===index)?
        this.renderCartItems(item.cart):<View/>}
        <TouchableOpacity
          onPress={()=>{
            Alert.alert("Mark Delivered and Paid", 
            (item.payment_method==='Paypal')?DELIVERED_MSG_PAYPAL:DELIVERED_MSG_OFFLINE,
            [
              {text:'Cancel'},
              {text:'OK', onPress:()=>{this.props.markDelivered(item._id)}},
            ],
            {cancelable:false},

            )
          }} 
          style={{padding:10, margin:5, alignSelf:'flex-start', borderRadius:10, 
            elevation:7, backgroundColor:COLORS.LIGHT_HEADER, borderWidth:2, borderColor:COLORS_DARK.RED}}>
          <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, color:COLORS.RED, fontSize:14}}>
            MARK DELIVERED
          </Text>
        </TouchableOpacity>
      </ShadowView>
    )
  }

  renderUpcomingOrders(){
    return(
      this.props.admin_orders.map((item, index)=>{
        return this.renderUpcomingOrderItem(item, index)
      })
    )
  }

  getAmountQuantity(){
    const {COLORS} = this.props;
    return (
      Object.keys(this.props.amount_quantity).map((amount)=>{
        return (
          <View style={{justifyContent:'space-between',marginHorizontal:10, alignItems:'center', flexDirection:'row', margin:2}}>
            <Text style={{fontFamily:FONTS.MERRIWEATHER, fontSize:18, color:COLORS.DARK}}>{amount}</Text>
            <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:18, color:COLORS.DARK}}>
              {this.props.amount_quantity[amount]}
            </Text>
          </View>
        )
      })
    )
  }

  renderAmountQuantity(){
    const {COLORS} = this.props;
    return (
      <View style={{marginHorizontal:20}}>
        <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:24, color:COLORS.DARK, marginBottom:5}}>
          Total Items
        </Text>
        {this.getAmountQuantity()}
      </View>
    )
  }

  render(){
    const {COLORS} = this.props;
    return (
      <View style={{flex:1, backgroundColor:COLORS.LIGHT}}>
        {this.renderHeader()}
        {
          (!this.props.admin_loading)?
          (
            <ScrollView refreshControl={
              <RefreshControl onRefresh={()=>{this.props.getAdminData()}}
                refreshing={false}
                colors={[COLORS.LIGHT_BLUE]}
              />}
            >
              {this.renderRevenue()}
              {this.renderAmountQuantity()}
              <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:24, color:COLORS.DARK, margin:20, marginBottom:5}}>
                Remaining Orders
              </Text>
              {this.renderUpcomingOrders()}
              <View style={{height:100}}/>
            </ScrollView>
          ):(
            <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
              <ActivityIndicator size="large" color={COLORS.LIGHT_BLUE} />
            </View>
          )
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    COLORS: state.home.COLORS,
    admin_orders: state.home.admin_orders,
    revenue: state.home.revenue,
    amount_quantity: state.home.amount_quantity,
    admin_loading: state.home.admin_loading
  }
}

export default connect(mapStateToProps, {getAdminData, markDelivered})(Admin);