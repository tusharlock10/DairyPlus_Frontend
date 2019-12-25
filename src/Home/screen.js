import React, {Component} from 'react';
import {View, Text, StatusBar, TextInput, Alert, Dimensions, TouchableOpacity, Keyboard,
  ScrollView, ActivityIndicator, FlatList, ImageBackground} from 'react-native';
import {FONTS, COLORS_LIGHT} from '../Constants';
import { connect } from 'react-redux';
import ShadowView from 'react-native-simple-shadow-view';
import Icon from 'react-native-vector-icons/Feather'
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Image from 'react-native-fast-image';
import BottomTab from '../Components/BottomTab';
import ProductOverlay from '../Components/ProductOverlay';
import {setAuthToken, getProducts, getSettings} from './action';
import { Actions } from 'react-native-router-flux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import LinerGradient from 'react-native-linear-gradient'
// import console = require('console');


const width = Dimensions.get('window').width
const CAROUSEL_WIDTH = width
const CARD_WIDTH = (width-60)/2
const CAROUSEL_DATA = [
  {image: require('../../assets/slider/slider1.jpg'), text:"Fresh Dairy Products"},
  {image: require('../../assets/slider/slider2.jpg'), text:"Natural Organic Dairy Products"},
  {image: require('../../assets/slider/slider3.jpg'), text:"Fresh & Healthy Farm Foods"},
  {image: require('../../assets/slider/slider4.jpg'), text:"Great Taste and Nutritional Value"},
  {image: require('../../assets/slider/slider5.jpg'), text:"Great Discounts and Fast Delivery"},
  {image: require('../../assets/slider/slider6.jpg'), text:"Available 2X7"},
]

class Home extends Component {

  state={
    search:'',
    showProductOverlay:false,
    currentItem: {},
    activeSlide:0
  }

  componentDidMount(){
    if (Object.keys(this.props.products).length===0){
      this.props.setAuthToken();
      this.props.getProducts();
    }
    if (this.props.settings_loading){
      this.props.getSettings();
    }
    changeNavigationBarColor(this.props.COLORS.LIGHT);
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
        <View>
          <Text style={{fontFamily:FONTS.RALEWAY_LIGHT, color:COLORS.DARK, fontSize:34}}>
            Dairy Plus
          </Text>
          <Text style={{fontFamily:FONTS.RALEWAY_BOLD, color:COLORS.LIGHT_BLUE, fontSize:12.4}}>
            {`HELLO ${this.props.settings.name.toUpperCase()},\nWHAT ARE YOU LOOKING FOR?`}
          </Text>
        </View>
        <Icon name="settings" size={24} onPress={()=>Actions.jump('settings')} color={COLORS.DARK} />
      </ShadowView>
    );
  }

  renderCarouselItem({item, index}){
    let ITEM_WIDTH = CAROUSEL_WIDTH-90;
    let ITEM_HEIGHT = ITEM_WIDTH * (9/16)
    const {COLORS} = this.props;
    return (
      <ShadowView style={{flex:1, borderRadius:12, 
        height:ITEM_HEIGHT,shadowColor: COLORS.SHADOW,
        shadowOpacity: 0.4,shadowOffset: { width: 0, height:5 },shadowRadius: 6,
        backgroundColor:COLORS.LIGHT_HEADER,marginVertical:15, marginHorizontal:10}}>
          <ImageBackground
            source={item.image}
            imageStyle={{borderRadius:12}}
            style={{flex:1}}>
            <LinerGradient
              colors={["rgba(0,0,0,0)", "rgba(128, 128, 128, 0.6)"]}
              style={{flex:1, justifyContent:'flex-end', padding:10, borderRadius:12}}>
              <Text style={{fontFamily:FONTS.PRODUCT_SANS, fontSize:12, color:COLORS_LIGHT.LIGHT}}>
                {item.text}
              </Text>
              
            </LinerGradient>
          </ImageBackground>
      </ShadowView>
    )
  }

  get_pagination(){
    const { activeSlide } = this.state;
    const {COLORS} = this.props;

    return (
      <Pagination
        dotsLength={CAROUSEL_DATA.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor:COLORS.LIGHT }}
        dotStyle={{width: 6,height: 6,borderRadius: 5,marginHorizontal: 5,
          backgroundColor: COLORS.LIGHT_BLUE, }}
        inactiveDotStyle={{height:5, width:5 }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  renderCarousel(){
    
    return (
      <View>
        <View style={{width:"100%",
          justifyContent:'center', alignItems:'center'}}>
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={CAROUSEL_DATA}
            renderItem={(item)=>this.renderCarouselItem(item)}
            sliderWidth={CAROUSEL_WIDTH}
            itemWidth={CAROUSEL_WIDTH-90}
            onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          />
        </View>
        {this.get_pagination()}
      </View>
    )
  }

  renderSearchBar(){
    const {COLORS} = this.props
    return (
      <View style={{
          alignItems:'center', paddingHorizontal:6,
          marginHorizontal:16, justifyContent:'space-between',
          height:36, width:null,flexDirection:'row', borderBottomWidth:0.6, borderColor:COLORS.DARK}}>
        <TextInput
          placeholder="Seach a Product ..."
          placeholderTextColor={COLORS.GRAY}
          value = {this.state.search}
          style={{fontFamily:FONTS.RALEWAY, fontSize:16,padding:4, color:COLORS.DARK, flex:1}}
          onChangeText={(text)=>{this.setState({search:text})}}
        />  
        {
          (this.state.search)?
            <Icon name="x" style={{paddingHorizontal:10}} size={20} onPress={
              ()=>{this.setState({search:''}); Keyboard.dismiss()}} 
              color={COLORS.DARK} />:
            <View/>
        }
          
      </View>
    )
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

  renderProducts(){
    let new_products;
    new_products = this.props.products
    if (this.state.search){
      new_products = []
      this.props.products.map((item)=>{
        if (item.name.toUpperCase().includes(this.state.search.toUpperCase())){
          new_products.push(item)
        }
      })
    }
    return (
      <FlatList
        data = {new_products}
        renderItem={({item})=>(
          <TouchableOpacity style={{flexDirection: 'column'}}
            activeOpacity={0.6}
            onPress={()=>{this.setState({showProductOverlay:true, currentItem:item})}}>
            {this.renderProductCard(item)}
          </TouchableOpacity>
        )}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{paddingBottom:30}}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  render() {
    const {COLORS} = this.props
    return (
      <View style={{flex:1, backgroundColor:COLORS.LIGHT}}>
        <StatusBar
          barStyle={COLORS.BAR_STYLE}
          backgroundColor={COLORS.LIGHT}
        />
        {changeNavigationBarColor(COLORS.LIGHT)}
        {this.renderHeader()}
        
        <BottomTab colors={COLORS}/>
        {
          (this.state.showProductOverlay)?
          (
            <ProductOverlay
              onRequestClose={()=>{this.setState({showProductOverlay:false, currentItem:{}})}}
              COLORS={COLORS}
              item={this.state.currentItem}
            />
          ):<View/>
        }
        {
          (this.props.loading)?(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <ActivityIndicator color={COLORS.LIGHT_BLUE} size="large"/>
            </View>
          ):
          (<ScrollView>
            {this.renderCarousel()}
            {this.renderSearchBar()}
            <Text style={{fontFamily:FONTS.LATO_BLACK, fontSize:24, 
              color:COLORS.DARK, marginHorizontal:15, marginTop:20, padding:5, borderBottomWidth:0, borderColor:COLORS.DARK}}>
              PRODUCTS
            </Text>
            {this.renderProducts()}
            <View style={{height:80}}/>
          </ScrollView>)
        }
        
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    COLORS: state.home.COLORS,
    loading: state.home.loading,
    products: state.home.products, 
    settings:state.home.settings,
    settings_loading: state.home.settings_loading,
    settings_backup: state.home.settings_backup,
  }
}

export default connect(mapStateToProps, {setAuthToken, getProducts, getSettings})(Home)
