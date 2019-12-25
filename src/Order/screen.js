import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StatusBar, FlatList, Image, ActivityIndicator} from 'react-native';
import {FONTS} from '../Constants';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { connect } from 'react-redux';
import {setAuthToken, getIncompleteOrders, changeButtonGroupIndex, refreshOrders} from './action';
import BottomTab from '../Components/BottomTab';
import {ButtonGroup} from 'react-native-elements';
import ShadowView from 'react-native-simple-shadow-view';
import Icon from 'react-native-vector-icons/Feather';
// import console = require('console');


class Order extends Component {

  state={
    openedOrdersIndex: -1,
  }

  componentDidMount(){
    this.props.setAuthToken();
    if (this.props.fetch_incomplete_orders){
      this.props.getIncompleteOrders()
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
          Orders
        </Text>
        <Text 
        onPress={()=>{this.props.refreshOrders(this.props.buttonGroupIndex)}}
        style={{fontFamily:FONTS.PRODUCT_SANS, textDecorationLine:'underline',
          fontSize:14, color:COLORS.LIGHT_BLUE}}>
          Refresh
        </Text>
      </ShadowView>
    );
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

    console.log("I am item; ", item)


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
              <View style={{justifyContent:'center', alignItems:'center'}}>
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
                {
                  (item.discount!==0)?(
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{color:COLORS.GRAY, textDecorationLine:'line-through', fontFamily:FONTS.EXPRESSWAY, fontSize:12}}>
                        $ {item.original_price}
                      </Text>
                      <Text style={{color:COLORS.GRAY, fontFamily:FONTS.EXPRESSWAY, fontSize:12}}>
                        {` ${item.discount}% OFF`}
                      </Text>
                    </View>
                  ):<View/>
                }
              </View>
              
            ):(
              <View style={{marginHorizontal:10, alignItems:'center'}}>
                <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:24, color:COLORS.RED}}>
                  $ {item.cart_price}
                </Text>
                {
                  (item.discount!==0)?(
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{color:COLORS.GRAY, textDecorationLine:'line-through', fontFamily:FONTS.EXPRESSWAY, fontSize:12}}>
                        $ {item.original_price}
                      </Text>
                      <Text style={{color:COLORS.GRAY, fontFamily:FONTS.EXPRESSWAY, fontSize:12}}>
                        {` ${item.discount}% OFF`}
                      </Text>
                    </View>
                  ):<View/>
                }
              </View>
            )
          }
        </View>
        <View style={{justifyContent:'center', padding:10, borderBottomWidth:0.5, borderColor:COLORS.GRAY}}>
          {
            (item.discount!==0)?(
              <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
                <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
                  {'Promo Code Applied - '}
                </Text>
                <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,}}>
                  {item.promo_code}
                </Text>
              </View>
            ):<View/>
          }
          <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
            Delivery Address
          </Text>
          <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,}}>
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
      </ShadowView>
    )
  }

  renderDeliveredOrderItem(item, index){
    const {COLORS} = this.props;
    let date_of_delivery = new Date(item.date_of_delivery)
    let time_of_delivery = date_of_delivery.toLocaleTimeString().toUpperCase();
    date_of_delivery = date_of_delivery.toDateString().toUpperCase();
    let date_ordered = new Date(item.date_ordered);
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

          <View style={{alignItems:'center'}}>
            <Text style={{fontFamily:FONTS.EXPRESSWAY, fontSize:24, color:COLORS.GREEN,}}>
              $ {item.cart_price}
            </Text>
            {
              (item.discount!==0)?(
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={{color:COLORS.GRAY, textDecorationLine:'line-through', fontFamily:FONTS.EXPRESSWAY, fontSize:12}}>
                    $ {item.original_price}
                  </Text>
                  <Text style={{color:COLORS.GRAY, fontFamily:FONTS.EXPRESSWAY, fontSize:12}}>
                    {` ${item.discount}% OFF`}
                  </Text>
                </View>
              ):<View/>
            }
          </View>

        </View>
        <View style={{justifyContent:'center', padding:10, borderBottomWidth:0.5, borderColor:COLORS.GRAY}}>
          {
            (item.discount!==0)?(
              <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
                <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
                  {'Promo Code Applied - '}
                </Text>
                <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,}}>
                  {item.promo_code}
                </Text>
              </View>
            ):<View/>
          }
          <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:16, color:COLORS.DARK}}>
            Delivery Address
          </Text>
          <Text style={{fontFamily:FONTS.RALEWAY, fontSize:14, color:COLORS.GRAY,}}>
            {item.address}
          </Text>
        </View>
        <View style={{margin:10, marginBottom:5, justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
          <View>
            <Text style={{fontFamily:FONTS.RALEWAY_BOLD, fontSize:12, color:COLORS.DARK}}>
              Date & Time of Delivery
            </Text>
            <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:16, color:COLORS.GREEN,}}>
              {date_of_delivery} {time_of_delivery}
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
      </ShadowView>
    )
  }

  renderUpcomingOrders(){
    const {COLORS} = this.props;
    if (this.props.incomplete_orders.length===0){
      return(
        <View style={{flex:1, justifyContent:'space-between', alignItems:'center', marginBottom:60}}>
          <ButtonGroup
            buttons={['UPCOMING', 'DELIVERED']}
            selectedIndex={this.props.buttonGroupIndex}
            onPress={(i)=>{this.props.changeButtonGroupIndex(i, this.props.fetch_completed_orders)}}
            innerBorderStyle={{color:COLORS.LESSER_DARK, width:2}}
            buttonStyle={{paddingHorizontal:0, backgroundColor:COLORS.LIGHT}}
            containerStyle={{alignSelf:'center', width:"70%", borderRadius:15, marginVertical:15, marginTop:10, borderColor:COLORS.LESSER_DARK, borderWidth:2}}
            textStyle={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:14, color:COLORS.DARK}}
            Component={TouchableOpacity}
            selectedButtonStyle={{backgroundColor:COLORS.LIGHT_BLUE}}
          />
          <View style={{alignItems:'center', justifyContent:'center'}}>
            <Image source={require('../../assets/no_upcomming_orders.png')} blurRadius={0.36}
              style={{height:256, width:256}}
            />
            <Text style={{color:COLORS.DARK, fontFamily:FONTS.GOTHAM_BLACK, fontSize:20, marginTop:-20, marginHorizontal:100, textAlign:'center'}}>
              NO UPCOMING ORDERS
            </Text>
          </View>
          <View/>
        </View>
      )
    }
    return (
      <View style={{flex:1}}>
        <FlatList
          ListHeaderComponent={
            <ButtonGroup
              buttons={['UPCOMING', 'DELIVERED']}
              selectedIndex={this.props.buttonGroupIndex}
              onPress={(i)=>{this.props.changeButtonGroupIndex(i, this.props.fetch_completed_orders)}}
              innerBorderStyle={{color:COLORS.LESSER_DARK, width:2}}
              buttonStyle={{paddingHorizontal:0, backgroundColor:COLORS.LIGHT}}
              containerStyle={{alignSelf:'center', width:"70%", borderRadius:15, marginVertical:15, padding:0, borderColor:COLORS.LESSER_DARK, borderWidth:2}}
              textStyle={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:14, color:COLORS.DARK}}
              Component={TouchableOpacity}
              selectedButtonStyle={{backgroundColor:COLORS.LIGHT_BLUE}}
            />
          }
          ListFooterComponent={<View style={{height:100}}/>}
          data = {this.props.incomplete_orders}
          renderItem={({item, index})=>{
            return this.renderUpcomingOrderItem(item, index)
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  renderCompletedOrders(){
    const {COLORS} = this.props;
    if (this.props.completed_orders.length===0){
      return(
        <View style={{flex:1, justifyContent:'space-between', alignItems:'center', marginBottom:60}}>
          <ButtonGroup
            buttons={['UPCOMING', 'DELIVERED']}
            selectedIndex={this.props.buttonGroupIndex}
            onPress={(i)=>{this.props.changeButtonGroupIndex(i, this.props.fetch_completed_orders)}}
            innerBorderStyle={{color:COLORS.LESSER_DARK, width:2}}
            buttonStyle={{paddingHorizontal:0, backgroundColor:COLORS.LIGHT}}
            containerStyle={{alignSelf:'center', width:"70%", borderRadius:15, marginVertical:15, marginTop:10, borderColor:COLORS.LESSER_DARK, borderWidth:2}}
            textStyle={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:14, color:COLORS.DARK}}
            Component={TouchableOpacity}
            selectedButtonStyle={{backgroundColor:COLORS.LIGHT_BLUE}}
          />
          <View style={{alignItems:'center', justifyContent:'center'}}>
            <Image source={require('../../assets/no_orders.png')} blurRadius={0.36}
              style={{height:256, width:256}}
            />
            <Text style={{color:COLORS.DARK, fontFamily:FONTS.GOTHAM_BLACK, 
              fontSize:20, marginTop:10, marginHorizontal:100, textAlign:'center'}}>
              NO ORDERS DELIVERED YET
            </Text>
          </View>
          <View/>
        </View>
      )
    }
    return (
      <View style={{flex:1}}>
        <FlatList
          ListHeaderComponent={
            <ButtonGroup
              buttons={['UPCOMING', 'DELIVERED']}
              selectedIndex={this.props.buttonGroupIndex}
              onPress={(i)=>{this.props.changeButtonGroupIndex(i, this.props.fetch_completed_orders)}}
              innerBorderStyle={{color:COLORS.LESSER_DARK, width:2}}
              buttonStyle={{paddingHorizontal:0, backgroundColor:COLORS.LIGHT}}
              containerStyle={{alignSelf:'center', width:"70%", borderRadius:15, marginVertical:15, padding:0, borderColor:COLORS.LESSER_DARK, borderWidth:2}}
              textStyle={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:14, color:COLORS.DARK}}
              Component={TouchableOpacity}
              selectedButtonStyle={{backgroundColor:COLORS.LIGHT_BLUE}}
            />
          }
          ListFooterComponent={<View style={{height:100}}/>}
          data = {this.props.completed_orders}
          renderItem={({item, index})=>{
            return this.renderDeliveredOrderItem(item, index)
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  renderFullOrders(){
    if (this.props.loading){
      return (
        <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size='large' color={this.props.COLORS.LIGHT_BLUE} style={{marginBottom:60}}/>
          <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:16, marginHorizontal:100, 
            color:this.props.COLORS.DARK, textAlign:'center'}}>
            {
              (this.props.buttonGroupIndex===0)?
              `${(this.props.refreshing)?'Refreshing':'Loading'} Upcoming Orders`:
              `${(this.props.refreshing)?'Refreshing':'Loading'} Delivered Orders`
            }
          </Text>
        </View>
      )
    }
    else if (this.props.buttonGroupIndex===0){
      return this.renderUpcomingOrders();
    }
    else{
      return this.renderCompletedOrders();
    }
  }

  render(){
    const {COLORS} = this.props;
    return (
      <View style={{flex:1, backgroundColor:COLORS.LIGHT}}>
        <StatusBar
          barStyle={COLORS.BAR_STYLE}
          backgroundColor={COLORS.LIGHT}
        />
        {changeNavigationBarColor(COLORS.LIGHT)}
        {this.renderHeader()}
        {this.renderFullOrders()}
        <BottomTab colors={COLORS}/>
      </View>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    COLORS:state.home.COLORS,
    fetch_incomplete_orders: state.order.fetch_incomplete_orders,
    fetch_completed_orders: state.order.fetch_completed_orders,
    completed_orders: state.order.completed_orders,
    incomplete_orders: state.order.incomplete_orders,
    buttonGroupIndex: state.order.buttonGroupIndex,
    loading: state.order.loading,
    refreshing: state.order.refreshing
  }
}

export default connect(mapStateToProps, {setAuthToken, getIncompleteOrders, 
  changeButtonGroupIndex, refreshOrders})(Order);