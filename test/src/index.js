import React from 'react';
import ReactDOM from 'react-dom';
import {combineReducers} from 'redux';
// import App from './App';

import Container from './Container'

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './redux/reducers/colorReducer';

// ReactDOM.render(<App />, document.getElementById('root'));
const store = createStore(combineReducers({
    color : reducer
  }), applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <Container></Container>
    </Provider>,
    document.getElementById('root')
);