import React, {Component} from 'react';
import {View, Text, StatusBar, 
  TextInput, TouchableOpacity, Keyboard, ActivityIndicator, BackHandler} from 'react-native';
import Image from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import {COLORS_LIGHT, FONTS, URLS, BASE_URL} from '../Constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LView from 'react-native-linear-gradient';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {loginAction, clearError, resetOTPSent, checkLogin, get_cart} from './action';


const COLOR1 = "#48b1bf";
const COLOR2 = "#06beb6";
const COLOR_MID = "#48B1BF"

class Login extends Component {

  state={
    isRegister:false,
    isLogin:false, 
    isKeyboardOpen:false, 
    registerData: {name:'', email:'', address:'', phone:'', otp:''},
    loginData: {phone:'', otp:''}
  }

  componentDidMount(){
    Keyboard.addListener('keyboardDidShow', ()=>{this.setState({isKeyboardOpen:true})})
    Keyboard.addListener('keyboardDidHide', ()=>{this.setState({isKeyboardOpen:false})});
    this.props.checkLogin();
    console.disableYellowBox = true
    BackHandler.addEventListener('hardwareBackPress', ()=>{
      if (!this.props.OTPLoading){
        this.setState({isRegister:false,isLogin:false});
        this.props.resetOTPSent();
        this.props.clearError();
      }
    })
    // this.props.get_cart();
    
  }

  renderRegisterBox(){
    return (
      <KeyboardAwareScrollView >
        {/* Body */}
        <View style={{height:50}}/>
        <View style={{justifyContent:'center', alignItems:'center', height:"80%"}}>
          <View style={{height:45, width:"90%", marginVertical:12, flexDirection:'row', alignItems:'center',
            backgroundColor:COLORS_LIGHT.LIGHT, borderRadius:10, elevation:5}}>
            <Text style={{fontSize:16, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLOR1}}>NAME</Text>
              <TextInput
                placeholder="Enter Your Name"
                placeholderTextColor={COLORS_LIGHT.LESSER_LIGHT}
                style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1, borderLeftWidth:1.5, paddingHorizontal:10,
                  fontSize:16,borderColor:COLORS_LIGHT.LIGHT, color:COLORS_LIGHT.LESSER_DARK}}
                onChangeText={(text)=>{this.setState({registerData:{...this.state.registerData, name:text}})}}
                multiline={false}
                keyboardType="default"
              />
          </View>

          <View style={{height:45, width:"90%", marginVertical:12, flexDirection:'row', alignItems:'center',
            backgroundColor:COLORS_LIGHT.LIGHT, borderRadius:10, elevation:5}}>
            <Text style={{fontSize:16, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLOR1}}>EMAIL</Text>
              <TextInput
                placeholder="Enter Your Email"
                placeholderTextColor={COLORS_LIGHT.LESSER_LIGHT}
                style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1, borderLeftWidth:1.5, paddingHorizontal:10,
                  fontSize:16, borderColor:COLORS_LIGHT.LIGHT, color:COLORS_LIGHT.LESSER_DARK}}
                  onChangeText={(text)=>{this.setState({registerData:{...this.state.registerData, email:text} })}}
                multiline={false}
                keyboardType="email-address"
              />
          </View>

          <View style={{width:"90%", marginVertical:12, flexDirection:'row', alignItems:'center',
            backgroundColor:COLORS_LIGHT.LIGHT, borderRadius:10, elevation:5}}>
            <Text style={{fontSize:14, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLOR1}}>ADDRESS</Text>
              <TextInput
                placeholder="Enter Your Address"
                placeholderTextColor={COLORS_LIGHT.LESSER_LIGHT}
                style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1, borderLeftWidth:1.5, paddingHorizontal:10,
                  fontSize:16, borderColor:COLORS_LIGHT.LIGHT, color:COLORS_LIGHT.LESSER_DARK}}
                  onChangeText={(text)=>{this.setState({registerData:{...this.state.registerData, address:text} })}}
                multiline={true}
                numberOfLines={3}
                keyboardType='default'
              />
          </View>

          <View style={{height:45, width:"90%", marginVertical:12, flexDirection:'row', alignItems:'center',
            backgroundColor:COLORS_LIGHT.LIGHT, borderRadius:10, elevation:5}}>
            <Text style={{fontSize:16, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLOR1}}>PHONE</Text>
              <TextInput
                placeholder="Enter Your Phone"
                placeholderTextColor={COLORS_LIGHT.LESSER_LIGHT}
                style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1, borderLeftWidth:1.5, paddingHorizontal:10,
                  fontSize:16, borderColor:COLORS_LIGHT.LIGHT, color:COLORS_LIGHT.LESSER_DARK}}
                  onChangeText={(text)=>{
                    this.setState({registerData:{...this.state.registerData, phone:text, otp:''}})
                    this.props.resetOTPSent()
                    this.props.clearError()
                  }}
                multiline={false}
                keyboardType="number-pad"
                maxLength={10}
              />
          </View>

          {
            (this.props.isOTPSent)?
            (
              (this.props.error!=="User already exists, please go back and login")?
              (<View style={{flex:1, alignItems:'center'}}>
                <Text style={{fontFamily:FONTS.HELVETICA_NEUE, fontSize:18, marginVertical:15, color:COLORS_LIGHT.LIGHT}}>
                  Enter the OTP you received
                </Text>
                <OTPInputView
                  style={{width: 240, height:50, alignItems:'center'}}
                  pinCount={4}
                  codeInputFieldStyle={{width:40, borderBottomWidth:1.5, fontSize:24,
                  borderWidth:0, padding:0, fontFamily:FONTS.HELVETICA_NEUE, color:COLORS_LIGHT.LIGHT}}
                  autoFocusOnLoad
                  onCodeFilled = {(text)=>{
                    this.setState({registerData:{...this.state.registerData, otp:text}});
                    this.props.loginAction('register', {...this.state.registerData, otp:text})
                    }}
                />
              </View>):<View/>
            ):
            (<TouchableOpacity style={{width:120, height:50, borderColor:COLORS_LIGHT.LIGHT, borderWidth:2,
              backgroundColor:COLOR_MID, elevation:7, justifyContent:'center', 
              alignItems:"center", borderRadius:10, margin:5}} activeOpacity={0.8}
              onPress={()=>{
                this.props.loginAction('register', this.state.registerData)
                }}>
              <Text style={{fontSize:18, fontFamily:FONTS.HELVETICA_NEUE, color:COLORS_LIGHT.LIGHT}} >
                Send OTP
              </Text>
            </TouchableOpacity>)
          }
          {(this.props.OTPLoading)?<ActivityIndicator size="small" style={{marginTop:15}} color={COLORS_LIGHT.LIGHT}/>:<View/>}
          {
            (this.props.error && !this.props.OTPLoading)?
            (
              <Text style={{fontSize:14, fontFamily:FONTS.PRODUCT_SANS, color:"rgb(255,19,50)",paddingHorizontal:10, marginTop:15,elevation:7, backgroundColor:COLORS_LIGHT.LIGHT, paddingVertical:6, borderRadius:30}}>
                {this.props.error}
              </Text>
            ):
            <View/>
          }

        </View>
        <View style={{height:50}}/>

      </KeyboardAwareScrollView>
    )
  }

  renderLoginBox(){
    if (this.state.isRegister){
      return this.renderRegisterBox()
    }
    else{
      return(
        <View style={{justifyContent:'flex-start', alignItems:'center', flex:1, marginTop:30}}>
          <View style={{height:50, width:"80%", marginTop:32, marginBottom:12,flexDirection:'row', alignItems:'center',
            backgroundColor:COLORS_LIGHT.LIGHT, borderRadius:10, elevation:7}}>
            <Text style={{fontSize:18, fontFamily:FONTS.PRODUCT_SANS, marginHorizontal:10, color:COLOR1}}>PHONE</Text>
              <TextInput
                placeholder="Enter Phone Number"
                placeholderTextColor={COLORS_LIGHT.LESSER_LIGHT}
                style={{fontFamily:FONTS.HELVETICA_NEUE, flex:1, paddingHorizontal:10,
                  fontSize:16, color:COLORS_LIGHT.LESSER_DARK}}
                  onChangeText={(text)=>{
                    this.setState({loginData:{...this.state.loginData, phone:text}})
                    this.props.resetOTPSent()
                    this.props.clearError()
                  }}
                multiline={false}
                keyboardType="number-pad"
                maxLength={10}
              />
          </View>
          {
            (this.props.isOTPSent)?
            (
              <View style={{alignItems:'center'}}>
                <Text style={{fontFamily:FONTS.HELVETICA_NEUE, fontSize:18, marginVertical:15, color:COLORS_LIGHT.LIGHT}}>
                  Enter the OTP you received
                </Text>
                <OTPInputView
                  style={{width: 240, height:50, alignItems:'center'}}
                  pinCount={4}
                  codeInputFieldStyle={{width:40, borderBottomWidth:1.5, fontSize:24,
                  borderWidth:0, padding:0, fontFamily:FONTS.HELVETICA_NEUE, color:COLORS_LIGHT.LIGHT}}
                  autoFocusOnLoad
                  onCodeFilled = {(text)=>{
                    this.setState({loginData:{...this.state.loginData, otp:text}});
                    this.props.loginAction('login', {...this.state.loginData, otp:text})
                    }}
                />
                
              </View>
            ):
            (<TouchableOpacity style={{width:120, height:50, borderColor:COLORS_LIGHT.LIGHT, borderWidth:2,
              backgroundColor:COLOR_MID, elevation:7, justifyContent:'center', 
              alignItems:"center", borderRadius:10, margin:5}} activeOpacity={0.8}
              onPress={()=>{
                this.props.loginAction('login', this.state.loginData)
                }}>
              <Text style={{fontSize:18, fontFamily:FONTS.HELVETICA_NEUE, color:COLORS_LIGHT.LIGHT}} >
                Send OTP
              </Text>
            </TouchableOpacity>)
          }
          {(this.props.OTPLoading)?<ActivityIndicator size="small" style={{marginTop:15}} color={COLORS_LIGHT.LIGHT}/>:<View/>}
          {
            (this.props.error && !this.props.OTPLoading)?
            (
              <Text style={{fontSize:14, fontFamily:FONTS.PRODUCT_SANS, color:"rgb(255,19,50)",paddingHorizontal:10, marginTop:15,elevation:7, backgroundColor:COLORS_LIGHT.LIGHT, paddingVertical:6, borderRadius:30}}>
                {this.props.error}
              </Text>
            ):
            <View/>
          }
        </View>
      )
    }
  }

  renderButtons(){
    return (
      <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <TouchableOpacity style={{width:150, height:60, 
          backgroundColor:COLORS_LIGHT.LIGHT, elevation:7, justifyContent:'center', 
          alignItems:"center", borderRadius:10, margin:10}} activeOpacity={0.8}
          onPress={()=>{this.setState({isLogin:true})}}>
          <Text style={{fontSize:32, fontFamily:FONTS.RALEWAY_LIGHT, color:COLOR1}} >Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:150, height:60, 
          backgroundColor:COLORS_LIGHT.LIGHT, elevation:7, justifyContent:'center', 
          alignItems:"center", borderRadius:10, margin:5}} activeOpacity={0.8}
          onPress={()=>{this.setState({isRegister:true})}}>
          <Text style={{fontSize:32, fontFamily:FONTS.RALEWAY_LIGHT, color:COLOR2}} >Register</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLoginHeader(){
    if (!this.state.isLogin && !this.state.isRegister){
      return <View/>
    }
    else{
      return (
        <View style={{flexDirection:'row', width:"100%", marginTop:10, alignItems:'center'}}>
          {
            (!this.props.OTPLoading)?
            (
              <TouchableOpacity 
                onPress={()=>{
                  this.setState({isRegister:false,isLogin:false});
                  this.props.resetOTPSent();
                  this.props.clearError();
                }}
                style={{backgroundColor:COLOR1,padding:8, borderRadius:100, borderColor:COLORS_LIGHT.LIGHT,
                  height:40, width:40, justifyContent:'center', alignItems:'center', 
                  elevation:12, borderWidth:0.8, marginHorizontal:20 }}>
                <Icon name="arrow-left" 
                  size={22} 
                  color={COLORS_LIGHT.LIGHT} />
              </TouchableOpacity>
            ):
            (
              <View style={{height:40, width:40,marginHorizontal:20 }}/>
            )
          }
          <Text style={{fontSize:38, fontFamily:FONTS.RALEWAY_LIGHT, color:COLORS_LIGHT.LIGHT}}>
            {(this.state.isRegister)?'Register':'Login'}
          </Text>
        </View>
      )
    }
  }

  renderFullLogin(){
    return (
      <LView
        colors={[COLOR1, COLOR2]}
        style={{flex:1, backgroundColor:COLORS_LIGHT.LIGHT, justifyContent:'center', alignItems:"center"}}>
        <StatusBar
          backgroundColor={COLOR1}
          barStyle="light-content"
        />
        {changeNavigationBarColor(COLOR2)}
        {this.renderLoginHeader()}
        {
          (this.state.isRegister || this.state.isLogin)?
          (<View/>):
          (<View style={{flex:1,justifyContent:'flex-end', alignItems:'center'}}>
            <Image
              source={require("../../assets/splash.jpeg")}
              style={{height:200, width:200}}
            />
            <Text style={{fontFamily:FONTS.PRODUCT_SANS, fontSize:12, color:COLORS_LIGHT.LIGHT}}>v0.1_alpha</Text>
          </View>)
        }
        <View style={{flex:1, width:"100%"}}>
          {
            (!this.state.isLogin && !this.state.isRegister)?
            this.renderButtons():
            this.renderLoginBox()
          }
        </View>
        <Text style={{color:COLORS_LIGHT.LIGHT, fontFamily:FONTS.PRODUCT_SANS}}>{(global.HermesInternal)?'Running HERMES ':'NOT Running HERMES'}</Text>
        <Text style={{color:COLORS_LIGHT.LIGHT, fontFamily:FONTS.PRODUCT_SANS}}>Base URL: {BASE_URL}</Text>
      </LView>
    )
  }
  renderLoadingSplash(){
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:COLORS_LIGHT.LIGHT}}>
        <StatusBar
          backgroundColor={COLORS_LIGHT.LIGHT}
          barStyle="dark-content"
        />
        {changeNavigationBarColor(COLORS_LIGHT.LIGHT)}
      </View>
    )
  }

  render(){
    if (this.props.login_loading){
      return this.renderLoadingSplash();
    }
    else{
      return this.renderFullLogin();
    }
  }


}

const mapStateToProps = (state) => {
  return {
    OTPLoading: state.login.OTPLoading,
    error: state.login.error,
    isOTPSent: state.login.isOTPSent,
    login_loading: state.login.login_loading
  }
}

export default connect(mapStateToProps, {loginAction, clearError, resetOTPSent, checkLogin, get_cart})(Login);
