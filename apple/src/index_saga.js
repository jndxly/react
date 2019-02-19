import React from 'react';
import ReactDOM from 'react-dom';


import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import reducer from './saga/reducers/colorReducer';

import ContainerSaga from './saga/component/ContainerSaga'
import createSagaMiddleware from 'redux-saga';
import sagas from './saga/sagas';


const sagaMidleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMidleware));
sagaMidleware.run(sagas);


ReactDOM.render(
  <Provider store={store}>
    <ContainerSaga></ContainerSaga>
  </Provider>,
  document.getElementById('app')
);