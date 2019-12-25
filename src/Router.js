import React, {Component} from 'react';
import {Scene, Router} from 'react-native-router-flux';
import Home from './Home/screen';
import Login from './Login/screen';
import Cart from './Cart/screen';
import Payment from './Cart/payment';
import Order from './Order/screen';
import Settings from './Home/settings';
import Admin from './Home/Admin';

class RouterComponent extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar>
          <Scene key="login">
            <Scene key="loginMain" component={Login} hideNavBar initial />
          </Scene>
          <Scene key="main">
            <Scene key="home" component={Home} hideNavBar />
            <Scene key="settings" component={Settings} hideNavBar />
            <Scene key="cart" component={Cart} hideNavBar />
            <Scene key="payment" component={Payment} hideNavBar />
            <Scene key="orders" component={Order} hideNavBar />
            <Scene key="admin" component={Admin} hideNavBar/>
          </Scene>
        </Scene>
      </Router>
    );
  }
}

export default RouterComponent;
