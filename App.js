import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import RouterComponent from './src/Router';
import reducers from './src/reducers'

const App = () => {
  const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
  return (
    <Provider store={store}>
      <RouterComponent />
    </Provider>
  );
};

export default App;
