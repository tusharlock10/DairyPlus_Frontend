import React, {Component} from 'react';
import {View, Text, StatusBar, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {toggleTheme, getSettings, changeSettingsData, updateSettings, cancelSettings} from './action';
import {FONTS, COLORS_LIGHT} from '../Constants';
import {Switch} from 'react-native-switch';
import ShadowView from 'react-native-simple-shadow-view';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Icon from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
// import console = require('console');


class Settings extends Component{

  componentDidMount(){
    if (this.props.settings_loading){
      this.props.getSettings();
    }
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
            this.props.cancelSettings()
          }}
          style={{
            height:34, width:40,justifyContent:'center', alignItems:'center',
            marginRight: 10,
          }}>
          <Icon size={24} color={COLORS.DARK} name="arrow-left" />
        </TouchableOpacity>
        <Text style={{fontFamily:FONTS.RALEWAY_LIGHT, color:COLORS.DARK, fontSize:34}}>
          Settings
        </Text>
      </ShadowView>
    );
  }

  renderSettings(){
    const {COLORS} = this.props;
    return (
      <View style={{alignItems:'center', marginTop:20, flex:1}}>
        <View style={{height:45, width:"90%", marginVertical:5, flexDirection:'row', alignItems:'center',
          backgroundColor:COLORS.LIGHT_HEADER, borderRadius:10, elevation:5}}>
          <Text style={{fontSize:16, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLORS.DARK}}>NAME</Text>
            <TextInput
              value = {this.props.settings.name}
              placeholder="Enter Your Name"
              placeholderTextColor={COLORS.LESSER_LIGHT}
              style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1,paddingHorizontal:10,
                fontSize:16,color:COLORS.LESSER_DARK}}
              onChangeText={(name)=>{
                this.props.changeSettingsData({...this.props.settings, name})
              }}
              multiline={false}
              keyboardType="default"
              textContentType = 'name'
            />
        </View>
        <View style={{width:"90%", marginVertical:5, flexDirection:'row', alignItems:'center',
          backgroundColor:COLORS.LIGHT_HEADER, borderRadius:10, elevation:5}}>
            <Text style={{fontSize:14, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLORS.DARK}}>ADDRESS</Text>
              <TextInput
                value = {this.props.settings.address}
                placeholder="Enter Your Address"
                placeholderTextColor={COLORS.LESSER_LIGHT}
                style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1,paddingHorizontal:10,
                  fontSize:16, color:COLORS.LESSER_DARK}}
                onChangeText={(address)=>{
                  this.props.changeSettingsData({...this.props.settings, address})
                }}
                multiline={true}
                numberOfLines={3}
                keyboardType='default'
                textContentType = "streetAddressLine1"
              />
          </View>
          <View style={{height:45, width:"90%", marginVertical:5, flexDirection:'row', alignItems:'center',
            backgroundColor:COLORS.LIGHT_HEADER, borderRadius:10, elevation:5}}>
            <Text style={{fontSize:16, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLORS.DARK}}>EMAIL</Text>
            <TextInput
              value = {this.props.settings.email}
              placeholder="Enter Your Name"
              placeholderTextColor={COLORS.LESSER_LIGHT}
              style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1, paddingHorizontal:10,
                fontSize:16,color:COLORS.LESSER_DARK}}
              onChangeText={(email)=>{
                this.props.changeSettingsData({...this.props.settings, email})
              }}
              multiline={false}
              keyboardType="default"
            />
          </View>
          <View style={{height:45, width:"90%", marginVertical:5, flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:16, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLORS.DARK}}>PHONE</Text>
              <TextInput
                value={this.props.settings.phone}
                style={{fontFamily:FONTS.HELVETICA_NEUE, paddingHorizontal:10,
                  fontSize:16.5, color:COLORS.DARK_GRAY}}
                multiline={false}
                editable = {false}
                maxLength={10}
              />
              <Text style={{fontFamily:FONTS.HELVETICA_NEUE, color:COLORS.GRAY, fontSize:10}}>
                {'  (not editable)'}
              </Text>
          </View>
          <Text style={{fontFamily:FONTS.RALEWAY,textAlign:'center', color:COLORS.GRAY, fontSize:10, marginHorizontal:20,}}>
            {'* Changing any of these values, will not change them in orders which are already placed'}
          </Text>
          <View style={{alignSelf:'flex-start', flexDirection:'row', marginHorizontal:15,marginTop:30, alignItems:'center'}}>
            <Text style={{fontFamily:FONTS.PRODUCT_SANS_BOLD, fontSize:18, color:COLORS.DARK, marginHorizontal:10}}>
              Dark Theme
            </Text>
            <Switch
              value = {(COLORS.THEME==='light')?false:true}
              onValueChange = {()=>{this.props.toggleTheme()}}
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
          </View>
          {
            (this.props.settings.isAdmin)?
            (
            <View style={{margin:20, alignSelf:'flex-start'}}>
              <TouchableOpacity
                onPress={()=>{
                  Actions.jump('admin')
                }} 
                style={{backgroundColor:COLORS.LIGHT_HEADER, borderWidth:2.5, borderRadius:12, borderColor:COLORS.RED, 
                paddingHorizontal:12, paddingVertical:8, elevation:7}}>
                <Text style={{fontFamily:FONTS.RALEWAY_BOLD, color:COLORS.RED, fontSize:18}}>ADMIN PANEL</Text>
              </TouchableOpacity>
            </View>
            ):<View/>
          }
          {this.renderUpdateButton()}
      </View>
    )
  }

  renderUpdateButton(){
    const {COLORS} = this.props;

    if (JSON.stringify(this.props.settings)===JSON.stringify(this.props.settings_backup)){
      return(
        <View style={{justifyContent:'space-around',width:"100%", alignItems:'center', flexDirection:'row', bottom:15, position:'absolute'}}>
          <TouchableOpacity
            disabled
            style={{paddingHorizontal:18,paddingVertical:12, elevation:3, borderColor:COLORS.DARK_GRAY,
            backgroundColor:COLORS.LIGHT_HEADER, borderRadius:12}}>
            <Text style={{fontFamily:FONTS.GOTHAM_BLACK, fontSize:18, color:COLORS.DARK_GRAY}}>
              UPDATE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled
            style={{paddingHorizontal:18,paddingVertical:12,elevation:3, borderColor:COLORS.DARK_GRAY,
            backgroundColor:COLORS.LIGHT_HEADER, borderRadius:12}}>
            <Text style={{fontFamily:FONTS.GOTHAM_BLACK, fontSize:18, color:COLORS.DARK_GRAY}}>
              CANCEL
            </Text>
          </TouchableOpacity>
        </View>
      )

    }
    return(
      <View style={{justifyContent:'space-around',width:"100%", alignItems:'center', flexDirection:'row', bottom:10, position:'absolute'}}>
        <TouchableOpacity
          activeOpacity = {0.75}
          onPress={()=>{this.props.updateSettings(this.props.settings)}} 
          style={{paddingHorizontal:18,paddingVertical:12, borderColor:COLORS.GREEN,
          backgroundColor:COLORS.LIGHT_HEADER, borderRadius:12, elevation:5}}>
          <Text style={{fontFamily:FONTS.GOTHAM_BLACK, fontSize:18, color:COLORS.GREEN}}>
            UPDATE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity = {0.75}
          onPress={()=>{this.props.cancelSettings()}} 
          style={{paddingHorizontal:18,paddingVertical:12, borderColor:COLORS.RED,
          backgroundColor:COLORS.LIGHT_HEADER, borderRadius:12, elevation:5}}>
          <Text style={{fontFamily:FONTS.GOTHAM_BLACK, fontSize:18, color:COLORS.RED}}>
            CANCEL
          </Text>
        </TouchableOpacity>
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
        {changeNavigationBarColor(COLORS.LIGHT)}

        {
          (this.props.settings_loading)?
          (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size='large' color={COLORS.LIGHT_BLUE}/>
          </View>):
          (this.renderSettings())
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    COLORS: state.home.COLORS,
    settings:state.home.settings,
    settings_loading: state.home.settings_loading,
    settings_backup: state.home.settings_backup,
  }
}

export default connect(mapStateToProps, {toggleTheme, getSettings, 
  changeSettingsData, updateSettings, cancelSettings})(Settings);