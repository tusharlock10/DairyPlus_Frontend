import React, {Component} from 'react';
import {View, Alert, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS_LIGHT } from '../Constants';
import {changeTab} from '../Home/action';
// import console = require('console');

class BottomTab extends Component {

  render(){
    const COLORS = this.props.colors
    return (
      <View style={{alignSelf:'center', bottom:5, borderRadius:15, justifyContent:'space-around',
        position:'absolute', height:55, width:"85%", flex:1, zIndex:100, alignItems:'center',
        backgroundColor:COLORS.BOTTOM_TAB_COLOR, flexDirection:'row'}}>

        <TouchableOpacity 
          style={{padding:10, borderRadius:100, elevation:4, backgroundColor:(this.props.tab_name==='home')?COLORS.LIGHT_BLUE:COLORS.LIGHT}}
          onPress={()=>{
            this.props.changeTab('home', this.props.tab_name);
          }}
          activeOpacity = {0.9}
        >
          <Icon name="home" size={24}  
            color={(this.props.tab_name==='home')?COLORS_LIGHT.LIGHT:COLORS.DARK}/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{padding:10, borderRadius:100,elevation:4, backgroundColor:(this.props.tab_name==='cart')?COLORS.LIGHT_BLUE:COLORS.LIGHT}}
          onPress={()=>{
            this.props.changeTab('cart', this.props.tab_name);
          }} 
          activeOpacity = {0.9}
        >
          <Icon name="shopping-bag" size={24} 
            color={(this.props.tab_name==='cart')?COLORS_LIGHT.LIGHT:COLORS.DARK} />
        </TouchableOpacity>
        
        
        <TouchableOpacity 
          style={{padding:10, borderRadius:100, elevation:4, backgroundColor:(this.props.tab_name==='orders')?COLORS.LIGHT_BLUE:COLORS.LIGHT}}
          onPress={()=>{
            this.props.changeTab('orders', this.props.tab_name);
          }}
          activeOpacity = {0.9}
        >
          <Icon name="list" size={24} 
            color={(this.props.tab_name==='orders')?COLORS_LIGHT.LIGHT:COLORS.DARK}/>
        </TouchableOpacity>
    
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    tab_name:state.home.tab_name
  }
}

export default connect(mapStateToProps, {changeTab})(BottomTab);